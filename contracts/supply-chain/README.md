[![Open in Gitpod](https://img.shields.io/badge/Open_in-Gitpod-white?logo=gitpod)](https://gitpod.io/#FOLDER=supply-chain/https://github.com/gear-foundation/dapps)
[![Docs](https://img.shields.io/github/actions/workflow/status/gear-foundation/dapps/contracts-docs.yml?logo=rust&label=docs)](https://dapps.gear.rs/supply_chain_io)

# [Supply chain](https://wiki.gear-tech.io/docs/examples/supply-chain)

### 🏗️ Building

```sh
cargo b -p "supply-chain*"
```

### ✅ Testing

Run only `gtest` tests:
```sh
cargo t -p "supply-chain*"
```

Run `gtest` & `gclient` tests:
```sh
# Download the node binary.
cargo xtask node
cargo t -p "supply-chain*" -- --include-ignored
```
