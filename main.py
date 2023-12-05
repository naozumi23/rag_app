import streamlit as st
from openai import OpenAI
# import os
# from os.path import join, dirname
# from dotenv import load_dotenv

# api key setting for local
# load_dotenv(join(dirname(__file__), '.env'))
# client = OpenAI(
#     api_key=os.environ.get("API_KEY"),
# )

# api key setting for deploy
client = OpenAI(
    api_key=st.secrets.ChatGptKey.key,
)


def ask_chatgpt():
    temp_messages = []

    # make prompt
    question = st.session_state.question_input.strip()
    str1 = "以下の文章を使用して、質問に回答してください。"
    str2 = "文章:"
    str3 = "質問:"
    prompt = f"{str1}\n{str2}\n{st.session_state.content}\n{str3}\n{question}"

    if question:
        # add question
        temp_messages.append({"role": "user", "content": prompt})
        st.session_state.messages.append({"role": "user", "content": question})
        st.session_state.question_input = ""

        # make response
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=temp_messages
        )
        # add response to session
        st.session_state.messages.append({'role': 'assistant', 'content': response.choices[0].message.content})


# main
def main():
    # show title
    st.title("RAG App")

    # abstract
    st.write('Return the answer from the sentences in the file')

    # initialize
    if "content" not in st.session_state:
        st.session_state.content = ''
        st.session_state.messages = []

    # text input
    uploaded_file = st.file_uploader("File Upload", type='txt')

    if uploaded_file:
        st.session_state.content = uploaded_file.read().decode('utf-8')

    # input question
    st.text_input("ask me anything !", key="question_input")

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
