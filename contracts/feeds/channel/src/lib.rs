#![no_std]

use channel_io::*;
use gstd::{debug, msg, prelude::*, ActorId};
use router_io::*;

gstd::metadata! {
    title: "GEAR Workshop Channel Contract",
    handle:
        input: ChannelAction,
        output: ChannelOutput,
    state:
      output: Vec<Message>,
}

#[derive(Default)]
pub struct Channel {
    pub owner_id: ActorId,
    pub router_id: ActorId,
    pub name: String,
    pub description: String,
    pub messages: Vec<Message>,
}

static mut CHANNEL: Option<Channel> = None;

impl Channel {
    pub fn set_owner_id(&mut self, id: ActorId) {
        self.owner_id = id;
    }

    pub fn set_router_id(&mut self, id: ActorId) {
        self.router_id = id;
    }

    pub fn is_owner(&self, id: ActorId) -> bool {
        id == self.owner_id
    }
    pub fn set_name(&mut self, name: &'static str) {
        self.name = String::from(name);
    }

    pub fn set_description(&mut self, desc: &'static str) {
        self.description = String::from(desc);
    }

    pub async fn register(&mut self, router_id: &ActorId) {
        assert_eq!(
            msg::source(),
            self.owner_id,
            "Only owner can register its channel"
        );
        self.set_router_id(*router_id);
        msg::send_for_reply_as::<_, RouterEvent>(
            *router_id,
            RouterAction::Register {
                name: self.name.clone(),
                description: self.description.clone(),
                owner_id: msg::source(),
            },
            0,
        )
        .expect("Error in sending a message `[RouterAction::Register]` to router contract")
        .await
        .expect("Unable to decode `RouterEvent`");
        msg::reply(ChannelOutput::Registered, 0)
            .expect("Error in reply to message  ChannelAction::Registered");
    }

    pub async fn add_subscriber(&mut self) {
        // send message to router contract to inform about new subscriber
        msg::send_for_reply_as::<_, RouterEvent>(
            self.router_id,
            RouterAction::AddSubscriberToChannel(msg::source()),
            0,
        ).expect("Error in sending async message `[RouterAction::AddSubscriberToChannel]` to router contract")
        .await
        .expect("Unable to decode `RouterEvent`");

        msg::reply(ChannelOutput::SubscriberAdded(msg::source()), 0)
            .expect("Error in reply to message  ChannelAction::Subscribe");
        debug!("CHANNEL {:?}: Subscriber added", self.name)
    }

    pub async fn remove_subscriber(&mut self) {
        // send message to router contract to delete a subscriber
        msg::send_for_reply_as::<_, RouterEvent>(
            self.router_id,
            RouterAction::RemoveSubscriberFromChannel(msg::source()),
            0,
        ).expect("Error in sending async message `[RouterAction::AddSubscriberToChannel]` to router contract")
        .await
        .expect("Unable to decode `RouterEvent`");

        msg::reply(ChannelOutput::SubscriberRemoved(msg::source()), 0)
            .expect("Error in reply to message  ChannelAction::Unsubscribe");

        debug!("CHANNEL {:?}: Subscriber removed", self.name)
    }

    pub fn add_message(&mut self, message: Message) {
        self.messages.push(message);
    }
}

#[no_mangle]
extern "C" fn init() {
    let mut channel: Channel = Default::default();
    channel.set_owner_id(msg::source());
    channel.set_name("Channel-Coolest-Name");
    channel.set_description("Channel-Coolest-Description");
    let init_message = Message::new(format!("Channel {:?} was created", channel.name));
    channel.add_message(init_message);
    debug!(
        "Channel {:?} initialized successfully!",
        channel.name.clone()
    );
    unsafe { CHANNEL = Some(channel) };
}

#[gstd::async_main]
async unsafe fn main() {
    let channel = unsafe { CHANNEL.get_or_insert(Default::default()) };
    let action: ChannelAction = msg::load().unwrap_or_else(|_| {
        panic!(
            "CHANNEL {:?}: Unable to decode Channel Action",
            channel.name
        )
    });

    debug!("CHANNEL {:?}: Received action: {:?}", channel.name, action);
    match action {
        ChannelAction::Register { router_contract_id } => {
            channel.register(&router_contract_id).await
        }
        ChannelAction::Subscribe => {
            channel.add_subscriber().await;
        }
        ChannelAction::Unsubscribe => {
            channel.remove_subscriber().await;
        }
        ChannelAction::Post(text) => {
            if !channel.is_owner(msg::source()) {
                panic!("CHANNEL {:?}: Poster is not an owner", channel.name)
            }

            let message = Message::new(text);

            channel.add_message(message.clone());

            msg::reply(ChannelOutput::MessagePosted(message.clone()), 0)
                .expect("Error in reply to message  ChannelAction::Post");

            debug!("Added a post: {:?}", message);
        }
    }
}

#[no_mangle]
pub unsafe extern "C" fn meta_state() -> *mut [i32; 2] {
    let channel = CHANNEL.get_or_insert(Default::default());
    let messages: Vec<Message> = channel.messages.clone();
    let encoded = messages.encode();
    gstd::util::to_leak_ptr(encoded)
}
