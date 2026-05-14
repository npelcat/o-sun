import { Heading, Text, Section } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface ContactAcknowledgmentEmailProps {
  name?: string;
  message?: string;
}

export function ContactAcknowledgmentEmail({
  name = "Marie Dupont",
  message = "Bonjour, je souhaite avoir plus d'informations sur vos services.",
}: ContactAcknowledgmentEmailProps) {
  const firstName = name.split(" ")[0];

  return (
    <EmailLayout>
      <Heading
        style={{
          color: "#6D7764",
          fontSize: "22px",
          fontFamily: "Georgia, serif",
          fontWeight: "normal",
          fontStyle: "italic",
          marginBottom: "8px",
        }}
      >
        Merci pour votre message 🌿
      </Heading>

      <Text style={{ color: "#4B4137", fontSize: "15px", lineHeight: "1.8" }}>
        Bonjour <strong>{firstName}</strong>,
      </Text>

      <Text style={{ color: "#4B4137", fontSize: "15px", lineHeight: "1.8" }}>
        Votre message m&apos;a bien été transmis, et je vous en remercie
        sincèrement. Je lirai votre message avec attention et reviendrai vers
        vous dès que possible. 🌸
      </Text>

      <Text
        style={{
          color: "#6D7764",
          fontSize: "13px",
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          margin: "28px 0 12px 0",
          fontWeight: "bold",
        }}
      >
        Voici le message que vous m&apos;avez transmis :
      </Text>
      <Section
        style={{
          borderLeft: "3px solid #D6E1DB",
          paddingLeft: "20px",
          margin: "0 0 28px 0",
        }}
      >
        <Text
          style={{
            color: "#4B4137",
            fontSize: "14px",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            lineHeight: "1.8",
            margin: 0,
            whiteSpace: "pre-wrap" as const,
          }}
        >
          {message}
        </Text>
      </Section>

      <Text
        style={{
          color: "#4B4137",
          fontSize: "15px",
          lineHeight: "1.8",
          margin: "0",
        }}
      >
        À très bientôt,
      </Text>
      <Text
        style={{
          color: "#6D7764",
          fontSize: "16px",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          margin: "4px 0 0 0",
        }}
      >
        O&apos;Sun 🌞
      </Text>
    </EmailLayout>
  );
}

export default ContactAcknowledgmentEmail;
