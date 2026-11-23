from flask import Blueprint, request, jsonify, Response, stream_with_context
import os
from mistralai.client import Mistral
from dotenv import load_dotenv
import logging
import json

# Set up logging for debug
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

chat_bp = Blueprint("chat_bp", __name__)

@chat_bp.route("/chat", methods=["POST"])
def chat():
    # Print API key in development so you can verify it
    if os.environ.get("NODE_ENV") == "development":
        load_dotenv(dotenv_path=".env.local")
        api_key = os.environ.get("MISTRAL_API_KEY")
        logger.debug("API Key for development: %s", api_key)
    
    try:
        data = request.get_json() or {}
        messages = data.get("messages", [])
        stream = data.get("stream", False)  # Get stream parameter from request
        logger.debug("Incoming messages: %s", messages)
        
        # Define the system prompt message
        system_prompt = {
            "role": "system",
            "content": (
                "You are an educational AI tutor. Engage in a natural and helpful conversation with the user "
                "to understand their learning/research goals and their current pre-knowledge. Ask follow-up questions "
                "if necessary to encourage further detail. Do NOT include any special markers or JSON formatting in your responses."
            )
        }
        
        # Prepend the system prompt to incoming messages
        combined_messages = [system_prompt] + messages
        logger.debug("Combined messages: %s", combined_messages)
        
        # Get the API key (ensure you have set the MISTRAL_API_KEY env variable)
        api_key = os.environ.get("MISTRAL_API_KEY")
        if not api_key:
            logger.error("MISTRAL_API_KEY not set!")
            return jsonify({"error": "MISTRAL_API_KEY not set"}), 500
        
        # Initialize the Mistral client
        client = Mistral(api_key=api_key)
        model = "mistral-large-latest"

        if stream:
            print("streaming response")
            def generate():
                try:
                    # Stream the response
                    stream_response = client.chat.stream(
                        model=model,
                        messages=combined_messages
                    )

                    for chunk in stream_response:
                        if chunk.data.choices[0].delta.content is not None:
                            # Format the chunk as SSE data
                            data = {
                                "choices": [{
                                    "delta": {
                                        "content": chunk.data.choices[0].delta.content
                                    },
                                    "finish_reason": chunk.data.choices[0].finish_reason if hasattr(chunk.data.choices[0], 'finish_reason') else None
                                }]
                            }
                            yield f"data: {json.dumps(data)}\n\n"
                    
                    # Send a final message to indicate the stream is done
                    yield "data: [DONE]\n\n"
                except Exception as e:
                    logger.exception("Streaming error:")
                    error_data = {"error": str(e)}
                    yield f"data: {json.dumps(error_data)}\n\n"

            return Response(
                stream_with_context(generate()),
                mimetype='text/event-stream',
                headers={
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Content-Type': 'text/event-stream'
                }
            )
        else:
            # Non-streaming response
            print("non-streaming response")
            chat_response = client.chat.complete(
                model=model,
                messages=combined_messages
            )
            logger.debug("chat_response: %s", chat_response)
            
            response_text = chat_response.choices[0].message.content
            logger.debug("Response from Mistral: %s", response_text)
            
            return jsonify({
                "choices": [{
                    "message": {"content": response_text},
                    "finish_reason": chat_response.choices[0].finish_reason
                }]
            }), 200
        
    except Exception as e:
        logger.exception("Chat API error:")
        return jsonify({"error": "Failed to process request"}), 500 