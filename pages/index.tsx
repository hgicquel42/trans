import { useEffect, useState } from "react"

export default function Home() {
  const [data, setData] = useState<string>()

  useEffect(() => {
    fetch("/api")
      .then(res => res.text())
      .then(setData)
  }, [])

  return <div>
    {data}
  </div>
}