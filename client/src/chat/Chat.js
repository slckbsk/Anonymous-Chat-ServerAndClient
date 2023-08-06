import React, { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { POST_MESSAGES } from "./queries";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Messages from "./ChatContainer";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery, useSubscription } from "@apollo/client";
import { GET_USERS, USERS_COUNT } from "./queries";
import Loading from "./Loading";


const Chat = () => {
  const location = useLocation();
  let user = null;
  let userId = null;




  if (location.state) {
    user = location.state.user;
    userId = location.state.userId;
  }
  const navigate = useNavigate();

  const [state, stateSet] = React.useState({
    id: userId,
    user: user,
    content: "",
  });
  const [postMessage] = useMutation(POST_MESSAGES);

  const { loading, error, data } = useQuery(GET_USERS);
  const { data: subscriptionData } = useSubscription(USERS_COUNT);

  useEffect(() => {
    if (!location.state) {
      console.log("Location state is null or undefined");
      navigate(`/`);
    }

    if (subscriptionData && data && subscriptionData.userCount === 0) {
      navigate(`/`);
    }
  }, [subscriptionData, loading, data, location.state, navigate]);

  if (loading)
    return (
      <Container
        style={{
          display: "flex",
          background: "#E5F9DB",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "1em",
          border: "1px solid Black",
          maxWidth: "70%",
          height: "700px",
          padding: 10,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 400,
          }}
        >
          <Loading />
        </div>
      </Container>
    );
  if (error) return <div>Error!: {error.message}</div>;

  const onSend = () => {
    if (state.content.length > 0) {
      postMessage({
        variables: state,
      });
    }

    stateSet({
      user: state.user,
      content: "",
    });
  };

  return (
    <Container
      style={{
        background: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "1em",
        border: "1px solid Black",
        maxWidth: "70%",
        height: "700px",
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          background: "white",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          height: "600px",
          overflowY: "scroll",
          margin: 10,
        }}
      >
        <Messages user={state.user} />
      </div>
      <Row style={{ margin: 15 }}>
        <Col
          sm={2}
          style={{
            background: "#58bf56",
            borderRadius: "0.3em",
          }}
        >
          <Form.Label
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              color: "white",
            }}
            aria-label="User"
            onChange={(e) => stateSet({ ...state, user: e.target.value })}
          >
            {user}
          </Form.Label>
        </Col>
        <Col sm={8}>
          <Form.Control
            value={state.content}
            aria-label="Content"
            onChange={(e) =>
              stateSet({
                ...state,
                content: e.target.value,
              })
            }
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                onSend();
              }
            }}
          />
        </Col>
        <Col sm={2} style={{ padding: 0 }}>
          <Button
            size="text"
            variant="primary"
            style={{ width: "100%" }}
            onClick={() => onSend()}
          >
            Send
          </Button>
        </Col>{" "}
      </Row>
    </Container>
  );
};

export default Chat;
