import { Container, Title } from "@mantine/core";
import MessageList from "@/components/MessageList";

export default function Home() {
  return (
    <Container>
      <Title order={2}>Chat Messages</Title>
      <MessageList />
    </Container>
  );
}
