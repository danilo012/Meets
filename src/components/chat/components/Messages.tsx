import ErrorBoundary from "../../error/ErrorBoundary"
import { useContext, useId } from "react"
import { ChatContext } from "../../../context/ChatContext"

const Messages = () => {
  const { messages }: any = useContext(ChatContext)

  return (
    <ErrorBoundary>
      <ul className="chat__meslist">
        {messages.map((mes: any) => (
          <li key={mes.randomId} className="item">
            <div className="item__wrapper">
              <img src={mes.image} alt="" className="item__icon" />
              <article className="item__info-wrapper">
                <p className="item__creator">{mes.creator}</p>
                <p className="item__message">{mes.message}</p>
              </article>
            </div>
          </li>
        ))}
      </ul>
    </ErrorBoundary>
  )
}

export default Messages