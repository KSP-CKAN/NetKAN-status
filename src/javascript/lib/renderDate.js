import moment from 'moment';

export default function(date) {
  return date ?
    moment(date).fromNow()
    : 'N/A';
}
