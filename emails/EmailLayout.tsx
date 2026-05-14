import { Html, Body, Container, Hr, Text, Head } from "@react-email/components";

interface EmailLayoutProps {
  children: React.ReactNode;
}

export function EmailLayout({ children }: EmailLayoutProps) {
  return (
    <Html lang="fr">
      <Head />
      <Body
        style={{
          backgroundColor: "#f9f5f3",
          fontFamily: "Georgia, 'Times New Roman', serif",
          margin: 0,
          padding: "40px 20px",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#f9f5f3",
          }}
        >
          {/* Header avec le nom du site */}
          <div
            style={{
              textAlign: "center" as const,
              marginBottom: "32px",
              paddingBottom: "24px",
              borderBottom: "2px solid #D6E1DB",
            }}
          >
            <Text
              style={{
                fontSize: "24px",
                color: "#6D7764",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                margin: 0,
                letterSpacing: "0.05em",
              }}
            >
              O&apos;Sun ~ Voix Animale
            </Text>
            <Text
              style={{
                fontSize: "12px",
                color: "#4B4137",
                opacity: 0.6,
                margin: "4px 0 0 0",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
              }}
            >
              Communication animale
            </Text>
          </div>

          {children}

          {/* Footer */}
          <Hr
            style={{
              border: "none",
              borderTop: "1px solid #e1d8d6",
              margin: "32px 0 24px",
            }}
          />
          <Text
            style={{
              fontSize: "11px",
              color: "#4B4137",
              opacity: 0.5,
              textAlign: "center" as const,
              margin: 0,
              letterSpacing: "0.05em",
            }}
          >
            O&apos;Sun ~ Voix Animale · Communication animale
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
