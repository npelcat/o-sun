import { Heading, Text, Section, Link } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface ConfirmationAdminEmailProps {
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  preferredPronoun: string;
  date: string;
  time: string;
  animalName: string;
  animalType: string | null;
  animalInfo: string | null;
  householdInfo: string | null;
  service: string;
  serviceSpecificAnswers: Record<string, string>;
  answers: string | null;
}

export function ConfirmationAdminEmail({
  clientName = "Jane Doe",
  clientEmail = "janedoe@gmail.com",
  clientPhone = "0606060606",
  preferredPronoun = "tutoiement",
  date = "15 juin 2025",
  time = "14h00",
  animalName = "Luna",
  animalType = "Chat",
  animalInfo = "Chatte de 3 ans, très anxieuse",
  householdInfo = "Vit avec un autre chat",
  service = "Communication animale - Clarté",
  serviceSpecificAnswers = {
    sujet_1: "Mon chat griffe les meubles",
    message_coeur: "Je t'aime Luna",
  },
  answers = null,
}: ConfirmationAdminEmailProps) {
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
        Nouvelle réservation reçue 📅
      </Heading>

      {/* Bloc client */}
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
          Informations client
        </Text>
        <InfoLine label="Nom" value={clientName} />
        <InfoLine
          label="Email"
          value={clientEmail}
          link={`mailto:${clientEmail}`}
        />
        {clientPhone && <InfoLine label="Téléphone" value={clientPhone} />}
        <InfoLine label="Préférence" value={preferredPronoun} />
        <InfoLine label="Date" value={`${date} à ${time}`} />
      </Section>

      {/* Bloc réservation */}
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
          Détails de la réservation
        </Text>
        <InfoLine
          label="Animal"
          value={`${animalName}${animalType ? ` (${animalType})` : ""}`}
        />
        {animalInfo && <InfoLine label="Infos animal" value={animalInfo} />}
        {householdInfo && (
          <InfoLine label="Infos foyer" value={householdInfo} />
        )}
        <InfoLine label="Service" value={service} />

        {Object.entries(serviceSpecificAnswers).map(([key, value]) => (
          <InfoLine key={key} label={key.replace(/_/g, " ")} value={value} />
        ))}

        {answers && (
          <InfoLine label="Informations complémentaires" value={answers} />
        )}
      </Section>

      <Text
        style={{
          color: "#6D7764",
          fontSize: "14px",
          fontStyle: "italic",
          borderLeft: "3px solid #D6E1DB",
          paddingLeft: "16px",
          margin: "24px 0",
        }}
      >
        Pense à confirmer cette réservation avec le client ! ✨
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

export default ConfirmationAdminEmail;
