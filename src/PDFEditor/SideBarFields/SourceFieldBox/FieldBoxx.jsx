import cn from 'classnames';
import { forwardRef } from 'react';
import styles from '../../FieldBox/FieldBox.module.scss'

import MaterialIcon, {colorPalette} from 'material-icons-react';
const FieldBoxx = forwardRef(({ label, className, ...props }, ref) => (
  <><div ref={ref} className={cn(styles.box, className)} {...props}>
  &nbsp;  &nbsp;   <i   style={{fontSize:'12px'}}>   {label}</i>
   
  </div>
  
 
 
 </>
));


export default FieldBoxx;
