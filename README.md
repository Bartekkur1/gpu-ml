# gpu-ml
Node js based machine learning library that uses GPU to accelerate matrix computation

## Some initial information

When I noticed how much progress library gpu.js did since last time I used it, I decided to give it another try.

This project was created for fun and research. Personally I think the best approach to learn something is to build it up from the ground up.

I know there are many ML frameworks, cool. Use them if you want.

I think this project only works for node version 14, didnt had time to check all of them.

Probably its because gpu.js lib is created for version 14, idk, idc.

If you want to build a solution with it, go ahead.
If you find any misspells or obvious things that can increase performance feel free to reach out to me.

## Performance

I included a small benchmark to test CPU vs GPU performance on different tasks.

1. Matrix multiplication
2. Matrix creation (which I removed GPU part because it was too slow (maybe I will add it back some day))

Results looks somewhere like this (On mac m1 pro, I dont know how about other spec, I will test it on rtx 3070 in future)

`npm run test-performance`

Multiplication test (in ms)

| size | CPU | GPU |
|-----:|----:|----:|
|10|0|17|
|100|9|13|
|500|698|39|
|1000|5801|146|

CPU Creation test (in ms)
| size | random | empty | identity |
|-----:|----:|----:|----:|
|100|0|1|0|
|500|7|4|5|
|1000|28|18|21|
|2000|137|78|81|
|5000|813|558|571|


## There are some ready solutions (WIP)

For example there is a ready version of XOR and mnist (but you have to download your own data set, link is in solution). You can run it by running `npm run solve-xor` or `npm run solve-mnist`.

I didn't use gpu computation for this one because its too simple, creating GPU kernels is too time consuming
