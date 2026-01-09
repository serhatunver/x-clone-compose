<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(4),
    password: z.string().min(6),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  console.log('Form submitted!', values);
  const res = await $fetch('http://localhost:3000/api/v1/auth/register', {
    method: 'POST',
    credentials: 'include',
    body: {
      username: values.username,
      password: values.password,
    },
  });
  console.log(res);
});
</script>

<template>
  <form class="grid gap-2" @submit.prevent="">
    <Card>
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl"> Create an account </CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <FormField v-slot="{ componentField }" name="username">
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="username"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </CardContent>
      <CardFooter class="flex flex-col gap-2">
        <Button @click="onSubmit" class="w-full rounded-full mb-2">
          Create account
        </Button>
        <Separator class="my-2" label="Or" />
        <div>Already have an account?</div>
        <NuxtLink class="w-full rounded-full" to="/login">
          <Button class="w-full rounded-full">Login</Button>
        </NuxtLink>
      </CardFooter>
    </Card>
  </form>
</template>
