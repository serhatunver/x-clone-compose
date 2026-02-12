import { Field } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { SearchIcon } from 'lucide-react';

export function SearchBar() {
  return (
    <Field className="max-w-sm">
      <InputGroup className="rounded-full border h-10 bg-transparent!">
        <InputGroupInput id="inline-start-input" placeholder="Search" />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
