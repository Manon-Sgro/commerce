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
  imageSrc?: string
  imageSrc2?: string
  product?: Product
  variant?: 'simple' | 'details'
  imgProps?: Omit<ImageProps, 'src'>
}

const placeholderImg = '/product-img-placeholder.svg'

const ProductCard2: FC<Props> = ({
  className,
  link = '',
  title,
  imageSrc,
  imageSrc2 = '',
  product,
  variant,
  imgProps,
  ...props
}) => (
  <div>
    {variant === 'simple' ? (
      <Link href={link} {...props}>
        <a>
          <div className="s.container">
            <div className="s.container_tag">
              <span>{title}</span>
            </div>
            <Image
              quality="85"
              src={imageSrc || placeholderImg}
              alt={title || 'Product Image'}
              height={320}
              width={320}
              layout="fixed"
              {...imgProps}
            />
          </div>
        </a>
      </Link>
    ) : (
      <div className="s.container">
        <Link href={link} {...props}>
          <div className="s.container_image">
            <div className="s.container_image_thumbnail">
              <Image
                quality="85"
                src={imageSrc || placeholderImg}
                alt={title || 'Product Image'}
                height={320}
                width={320}
                layout="fixed"
                {...imgProps}
              />
            </div>
            {imageSrc2 != '' && (
              <div className="s.container_image_thumbnail">
                <Image
                  quality="85"
                  src={imageSrc2 || placeholderImg}
                  alt={title || 'Product Image'}
                  height={320}
                  width={320}
                  layout="fixed"
                  {...imgProps}
                />
              </div>
            )}
          </div>
        </Link>
        <Link href={link} {...props}>
          <h3 className={s.productTitle}>
            <span>{title}</span>
          </h3>
        </Link>
        {product && (
          <div className={s.productPrice}>
            <div className={s.productPrice_price}>
              {product.price.value}
              &nbsp;
              {product.price.currencyCode}
            </div>
            <Link href={link} {...props}>
              {product.price.value}
              &nbsp;
              {product.price.currencyCode}
            </Link>
          </div>
        )}
      </div>
    )}
  </div>
)

export default ProductCard2
