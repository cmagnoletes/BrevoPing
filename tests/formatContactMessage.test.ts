import { formatContactMessage } from "@/src/message/formatContactMessage";

describe("formatContactMessage", () => {
  it("formats all populated fields and skips empty ones", () => {
    const message = formatContactMessage({
      id: 123,
      email: "user@example.com",
      createdAt: "2024-01-01T00:00:00Z",
      listIds: [1, 2],
      attributes: {
        FIRSTNAME: "Ada",
        SOURCE: "Landing",
        EMPTY: "",
      },
      extra: { nested: true },
    });

    expect(message).toContain("🆕 New Brevo Contact");
    expect(message).toContain("id: 123");
    expect(message).toContain("email: user@example.com");
    expect(message).toContain("createdAt: 2024-01-01T00:00:00Z");
    expect(message).toContain("listIds: [\n  1,\n  2\n]");
    expect(message).toContain("attributes.FIRSTNAME: Ada");
    expect(message).toContain("attributes.SOURCE: Landing");
    expect(message).toContain(`extra: {\n  "nested": true\n}`);
    expect(message).not.toContain("attributes.EMPTY");
  });
});
