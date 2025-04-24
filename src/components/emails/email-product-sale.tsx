interface EmailLink {
  confirmLink: string;
}

export const ProductSale = ({ confirmLink }: EmailLink) => {
  return (
    <div>
      <h1>Shop Sphere</h1>
      <div>
        <h2>Jusu favoritetais produkts ir uz izpardosanu!</h2>
        <p>Lai aizietu uz produkta lapu, noklikšķiniet uz saites zemāk:</p>
        <a href={confirmLink}>Produkta lapa</a>
      </div>
    </div>
  );
};
