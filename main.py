import streamlit as st
import requests


def ask_chatgpt():
    # make prompt
    question = st.session_state.question_input.strip()
    if question:
        # add question
        st.session_state.messages.append({"role": "user", "content": question})
        st.session_state.question_input = ""

        # json data to send
        data_to_send = {
            "message": question,
        }

        # make response
        # url = 'https://chat-bot-2qp7t1px.an.gateway.dev/chat_bot'
        url = 'https://asia-northeast1-rag-project-407707.cloudfunctions.net/chat-bot'
        response = requests.post(url, json=data_to_send)

        # add response to session
        st.session_state.messages.append({'role': 'assistant', 'content': response.json()['response']})


# main
def main():
    # show title
    st.title("RAG App")

    # initialize
    if "content" not in st.session_state:
        st.session_state.content = ''
        st.session_state.messages = []

    # input question
    st.text_input('write question here !', key="question_input")

    # button click
    st.button("ask", on_click=ask_chatgpt)

    # show question and answer
    col1, col2 = st.columns(2)
    for message in st.session_state.messages:
        if message["role"] == "user":
            col1.write(message["content"])
        elif message["role"] == "assistant":
            col2.write(message["content"])
            col1, col2 = st.columns(2)


if __name__ == "__main__":
    main()
