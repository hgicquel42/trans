import { Layout } from "comps/layout/layout";

export default function Page() {

  return (
    <>
      <Layout>
        <div>
          <div className='h-[75px]' />
          <div className="w-full text-center font-pixel text-4xl">Sign In</div>
          <div className='h-[50px]' />
          <div className="flex justify-center">
            <input className="shadow appearance-none border rounded py-2 px-3 font-pixel" id="username" type="text" placeholder="Username" />
          </div>
          <div className='h-[25px]' />
          <div className="flex justify-center">
            <input className="shadow appearance-none border rounded py-2 px-3 font-pixel" id="username" type="password" placeholder="Password" />
          </div>
          <div className='h-[25px]' />
          <div className='flex justify-center'>
            <a className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform">
              <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Log In</div>
            </a>
          </div>
          <div className='h-[25px]' />
          <div className='flex justify-center'>
            <a className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform">
              <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Create Account</div>
            </a>
          </div>
          <div className='h-[25px]' />
          <div className='flex justify-center'>
            <a className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform">
              <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Log As Guest</div>
            </a>
          </div>
        </div>
      </Layout>
    </>
  )
}