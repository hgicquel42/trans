import { Layout } from "comps/layout/layout";
import { Modal } from "comps/modal/modal";
import { Anchor } from "comps/next/anchor";
import { useElement } from "libs/react/handles/element";
import { usePopper } from 'react-popper';

export default function Page() {
  return <Layout>
    <div className='h-[50px]' />
    <div className="w-full text-center font-pixel text-4xl">pong.board</div>
    <div className='h-[50px]' />
    <div className="w-full aspect-video border-8 border-opposite">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast">
              Name
            </th>
            <th className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast">
              Position
            </th>
            <th className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast">
              Win / Lose
            </th>
          </tr>
        </thead>
        <tbody>
          <Board pos={1} bg={'bg-yellow-400'} />
          <Board pos={2} bg={'bg-neutral-400'} />
          <Board pos={3} bg={'bg-yellow-700'} />
          <Board pos={4} bg={'bg-opposite'} />
          <Board pos={5} bg={'bg-opposite'} />
          <Board pos={6} bg={'bg-opposite'} />
          <Board pos={7} bg={'bg-opposite'} />
          <Board pos={8} bg={'bg-opposite'} />
          <Board pos={9} bg={'bg-opposite'} />
        </tbody>
      </table >
    </div >
  </Layout >
}

function Board(props: {
  pos: number
  bg: string
}) {
  return <tr>
    <td className={`px-6 py-3 border-b border-opposite ${props.bg}`}>
      <div className="flex item-center\">
        <div className="px-2 py-2">
          <BoardDropdown />
        </div>
        <div className="text-sm font-pixel pt-6">
          Test
        </div>
      </div>
    </td>
    <td className={`px-6 py-3 border-b border-opposite ${props.bg}`}>
      <div className="font-pixel pt-2 pl-7">
        # {props.pos}
      </div>
    </td>
    <td className={`px-6 py-3 border-b border-opposite ${props.bg}`}>
      <div className="flex item-center font-pixel pt-2 pl-3">
        125 / 48
      </div>
    </td>
  </tr>
}

export function BoardDropdown() {
  const reference = useElement<HTMLButtonElement>()
  const dropdown = useElement<HTMLDivElement>()

  const popper = usePopper(
    reference.value, dropdown.value,
    { strategy: "fixed", placement: "bottom-start" })

  return (
    <>
      <button className="w-12 h-12"
        onClick={reference.use}>
        <img src="https://pbs.twimg.com/profile_images/1385891929917992960/J7hK0tks_400x400.jpg" className="w-12 h-12 rounded-full" alt="" />
      </button>
      {reference.value && <Modal>
        <div className="fixed inset-0"
          onClick={reference.unset} />
        <div className="font-pixel py-2 text-center rounded shadow-lg border-2 border-opposite z-10 min-w-[12rem] bg-zinc-300 dark:bg-zinc-400"
          style={popper.styles.popper}
          {...popper.attributes.popper}
          ref={dropdown.set}>
          <Anchor className="text-sm py-2 px-4 block text-zinc-800 hover:underline"
            href="/profil">
            Profil
          </Anchor>
          <div className="h-0 my-2 border border-solid border-t-0 border-opposite" />
          <a className="text-sm py-2 px-4 block text-zinc-800 hover:underline">
            Play
          </a>
        </div>
      </Modal>}
    </>
  );
}