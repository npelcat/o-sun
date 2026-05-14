import { Heading, Text, Section, Link } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface ContactNotificationEmailProps {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactNotificationEmail({
  name = "Marie Dupont",
  email = "marie@gmail.com",
  message = "Bonjour, je souhaite avoir plus d'informations sur vos services.",
}: ContactNotificationEmailProps) {
  return (
    <EmailLayout>
      <Heading
        style={{
          color: "#6D7764",
          fontSize: "20px",
          fontFamily: "Georgia, serif",
          fontWeight: "normal",
          fontStyle: "italic",
          marginBottom: "8px",
        }}
      >
        Nouveau message reçu 💌
      </Heading>

      <Section
        style={{
          backgroundColor: "#D6E1DB",
          borderRadius: "8px",
          padding: "20px 24px",
          margin: "20px 0",
        }}
      >
        <Text
          style={{
            color: "#6D7764",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            margin: "0 0 16px 0",
            fontWeight: "bold",
          }}
        >
          Expéditeur
        </Text>
        <InfoLine label="Nom" value={name} />
        <InfoLine label="Email" value={email} link={`mailto:${email}`} />
      </Section>

      <Section
        style={{
          backgroundColor: "#e1d8d6",
          borderRadius: "8px",
          padding: "20px 24px",
          margin: "20px 0",
        }}
      >
        <Text
          style={{
            color: "#6D7764",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            margin: "0 0 16px 0",
            fontWeight: "bold",
          }}
        >
          Message
        </Text>
        <Text
          style={{
            color: "#4B4137",
            fontSize: "14px",
            lineHeight: "1.7",
            margin: 0,
            whiteSpace: "pre-wrap" as const,
          }}
        >
          {message}
        </Text>
      </Section>

      <Text
        style={{
          color: "#6D7764",
          fontSize: "11px",
          fontStyle: "italic",
          textAlign: "center" as const,
          opacity: 0.6,
        }}
      >
        Message automatique — formulaire de contact.
      </Text>
    </EmailLayout>
  );
}

function InfoLine({
  label,
  value,
  link,
}: {
  label: string;
  value: string;
  link?: string;
}) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <Text
        style={{
          margin: 0,
          fontSize: "11px",
          color: "#6D7764",
          textTransform: "uppercase" as const,
          letterSpacing: "0.08em",
          fontWeight: "bold",
        }}
      >
        {label}
      </Text>
      {link ? (
        <Link
          href={link}
          style={{
            display: "block",
            marginTop: "2px",
            fontSize: "14px",
            color: "#4B4137",
            textDecoration: "underline",
          }}
        >
          {value}
        </Link>
      ) : (
        <Text
          style={{
            margin: "2px 0 0 0",
            fontSize: "14px",
            color: "#4B4137",
            lineHeight: "1.5",
          }}
        >
          {value}
        </Text>
      )}
    </div>
  );
}

export default ContactNotificationEmail;
