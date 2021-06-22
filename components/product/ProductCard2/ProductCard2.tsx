import { FC } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import type { Product } from '@commerce/types'
import s from './ProductCard2.module.css'
import Image, { ImageProps } from 'next/image'
//import WishlistButton from '@components/wishlist/WishlistButton'
//import image from 'next/image'

interface Props {
  className?: string
  link?: string
  title?: string
  subtitle?: string
  imageSrc?: string
  imageSrc2?: string
  product?: Product
  variant?: 'simple' | 'details' | 'full'
  imgProps?: Omit<ImageProps, 'src'>
}

const placeholderImg = '/product-img-placeholder.svg'

const ProductCard2: FC<Props> = ({
  className,
  link = '',
  title,
  subtitle,
  imageSrc,
  imageSrc2 = '',
  product,
  variant,
  imgProps,
  ...props
}) => (
  <div>
    {variant === 'simple' && (
      <Link href={link} {...props}>
        <a>
          <div className={s.container}>
            <Image
              quality="85"
              src={imageSrc || placeholderImg}
              alt={title || 'Product Image'}
              height={256}
              width={206}
              objectFit="cover"
              layout="fixed"
              {...imgProps}
            />
            <div className={s.container_tag}>
              <span>{title}</span>
            </div>
          </div>
        </a>
      </Link>
    )}
    {variant === 'full' && (
      <Link href={link} {...props}>
        <a>
          <div className={s.container__full}>
            <Image
              quality="85"
              src={imageSrc || placeholderImg}
              alt={title || 'Product Image'}
              height={600}
              width={600}
              objectFit="cover"
              layout="fixed"
              {...imgProps}
            />
            <div className={s.container_tag__noBg}>
              <div className={s.title}>{title}</div>
              <div className={s.subtitle}>{subtitle}</div>
            </div>
          </div>
        </a>
      </Link>
    )}
    {variant === 'details' && (
      <div className={s.container}>
        <Link href={link} {...props}>
          <a>
            <div className={s.container_image}>
              <div
                className={`${s.container_image_thumbnail} ${
                  imageSrc2 != '' ? s.toHide : ''
                }`}
              >
                <Image
                  quality="85"
                  src={imageSrc || placeholderImg}
                  alt={title || 'Product Image'}
                  height={256}
                  width={206}
                  objectFit="contain"
                  layout="fixed"
                  {...imgProps}
                />
              </div>
              {imageSrc2 != '' && (
                <div className={s.container_image_thumbnail}>
                  <Image
                    quality="85"
                    src={imageSrc2 || placeholderImg}
                    alt={title || 'Product Image'}
                    height={256}
                    width={206}
                    objectFit="contain"
                    layout="fixed"
                    {...imgProps}
                  />
                </div>
              )}
            </div>
          </a>
        </Link>
        <Link href={link} {...props}>
          <a>
            <h3 className={s.product_title}>
              <span>{title}</span>
            </h3>
          </a>
        </Link>
        {product && (
          <div className={s.product_price}>
            <div className={s.product_price_text}>
              {product.price.value}
              &nbsp;
              {product.price.currencyCode}
            </div>
            <div>
              <Link href={link} {...props}>
                <a className={s.btn}>Ajouter au panier</a>
              </Link>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
)

export default ProductCard2
