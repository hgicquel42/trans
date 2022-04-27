import { Layout } from "comps/layout/layout";

export default function Page() {
	return <Layout>
		<div className="flex justify-center mt-20 mb-4">
			<p className="text-center text-2xl font-pixel">Enter your Authentification Code :</p>
		</div>
		<div className="flex justify-center mt-8 mb-4">
			<input className="shadow appearance-none border rounded py-2 px-3 font-pixel"
				type="text" placeholder="Authentication Code">
			</input>
		</div>
	</Layout>
}