interface EmailLink {
  confirmLink: string;
}

export const EmailVerification = ({ confirmLink }: EmailLink) => {
  return (
    <div>
      <h1>Shop Sphere</h1>
      <div>
        <h2>Verificējiet savu e-pastu</h2>
        <p>
          Lai verificētu savu e-pastu, lūdzu, noklikšķiniet uz saites zemāk:
        </p>
        <a href={confirmLink}>Verificēt e-pastu</a>
      </div>
    </div>
  );
};
