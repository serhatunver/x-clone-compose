import { Field } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { SearchIcon } from 'lucide-react';

export function SearchBar() {
  return (
    <Field>
      <InputGroup className="rounded-full border h-11 bg-transparent! has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-sky-400 has-[[data-slot=input-group-control]:focus-visible]:border-[2px]">
        <InputGroupInput id="inline-start-input" placeholder="Search" />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
