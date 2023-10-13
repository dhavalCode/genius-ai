import { BrainCreationForm } from "@/components/BrainCreationForm";
import Layout from "@/components/Layout";

const BrainIdPage = () => {
  return (
    <Layout>
      <BrainCreationForm initialData={null} categories={[]} />
    </Layout>
  );
};

export default BrainIdPage;
