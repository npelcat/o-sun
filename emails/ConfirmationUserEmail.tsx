import { Heading, Text, Section } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface ConfirmationUserEmailProps {
  clientName: string;
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

export function ConfirmationUserEmail({
  clientName = "Jane Doe",
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
}: ConfirmationUserEmailProps) {
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
        Votre demande a bien été reçue ✨
      </Heading>

      <Text style={{ color: "#4B4137", fontSize: "15px", lineHeight: "1.7" }}>
        Bonjour <strong>{clientName}</strong>,
      </Text>
      <Text style={{ color: "#4B4137", fontSize: "15px", lineHeight: "1.7" }}>
        J&apos;ai bien reçu votre réservation pour le{" "}
        <strong>
          {date} à {time}
        </strong>
        . Je vous répondrai très bientôt !
      </Text>

      {/* Récap réservation */}
      <Section
        style={{
          backgroundColor: "#e1d8d6",
          borderRadius: "8px",
          padding: "20px 24px",
          margin: "24px 0",
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
          Détails de votre réservation
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
          lineHeight: "1.7",
          borderLeft: "3px solid #D6E1DB",
          paddingLeft: "16px",
          margin: "24px 0",
        }}
      >
        Merci de votre confiance. Je prends soin de chaque demande avec
        attention. 🌿
      </Text>
    </EmailLayout>
  );
}

// Composant interne pour une ligne d'info
function InfoLine({ label, value }: { label: string; value: string }) {
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
    </div>
  );
}
// Export par défaut nécessaire pour la preview React Email
export default ConfirmationUserEmail;
