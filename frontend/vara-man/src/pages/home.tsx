import { HomeRegister } from '@/components/sections/home/home-register'
import { HomeNotActive } from '@/components/sections/home/home-not-active'
import { useGame } from '@/app/context/ctx-game'

export default function Home() {
  const { status } = useGame()

  if (status === "Started") {
    return <HomeRegister />
  }

  if (status === "Paused") {
    return <HomeNotActive />
  }
}
