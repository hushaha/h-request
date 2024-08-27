<template>
	<button @click="onClick">get</button>
</template>
<script setup lang="ts">
import { apiList } from './request';

const onClick = async () => {
	const res = await apiList.getUser({
		petId: '1'
	});

	console.log(res);
};
</script>

<style scoped></style>
