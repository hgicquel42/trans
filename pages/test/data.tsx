import { useEffect, useState } from "react"

export default function Page() {
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