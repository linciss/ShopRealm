import { checkHasStore } from '../../../../data/store';

export default async function Store() {
  await checkHasStore();

  return (
    <div className='py-10'>
      <h1 className='text-2xl font-bold'>Mans veikkals</h1>
    </div>
  );
}
