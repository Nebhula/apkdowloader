import { Link } from '@nextui-org/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Logo = ({ websiteName }) => {
  const router = useRouter();
  const { locale: activeLocal } = router;
  return (
    <Link href={activeLocal} className="font-bold text-inherit">{websiteName}</Link>
  );
};

export default Logo;
