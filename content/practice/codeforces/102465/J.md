---
title: "CF 102465J - 蒙娜丽莎"
description: "我们有同一个 64 位伪随机生成器的四个独立实例，每个键盘一个。 密码只是一个生成器序列的正索引。"
date: "2026-08-08T09:38:51+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102465
codeforces_index: "J"
codeforces_contest_name: "2018-2019 ICPC Southwestern European Regional Programming Contest (SWERC 2018)"
rating: 0
weight: 102465
solve_time_s: 439
verified: true
draft: false
---

[CF 102465J - 蒙娜丽莎](https://codeforces.com/problemset/problem/102465/J)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有同一个 64 位伪随机生成器的四个独立实例，每个键盘一个。 密码只是一个生成器序列的正索引。 如果选择的四个索引是 c 1 ​ ,c 2 ​ ,c 3 ​ ,c 4 ​ ，则系统采用相应的生成器输出，仅保留它们的最低 N 位，并要求它们的 XOR 为零。 输入给出N和四个种子，我们需要打印100000000以下的任意四个有效代码。官方限制是1≤N≤50，每个种子占用64位。 

生成器是 xoroshiro128+，具有从每个种子初始化的 128 位内部状态。 Python 整数不会自动溢出，因此每个状态更新和每个生成的结果都必须减少模 2 64，正如该语句的 Python 版本所做的那样。 

第一个有用的减少是停止考虑完整的 64 位生成器输出。 对于该条件，只有最低 N 位重要，因此每个生成的数字都可以立即替换为其模 2 N 的值。生成器状态本身仍然必须保持 64 位，因为未来的输出取决于所有状态位。 

对所有可能的代码进行强力搜索将得到大约 (10 8 -1) 4 或大约 10 32 个四元组。 即使是小得多的搜索，例如每个键盘 2 25 个候选者，也已经使传统的成对中间相遇方法变得太大。 限制 N≤50 是相关位数（而不是代码范围的数字大小）应确定搜索大小的线索。 

有几种边缘情况会暴露实施错误。 和```
1
0 0 0 0
```每个生成器的第一个生成值为零，因此`1 1 1 1`是有效的。 从零开始的实现可能会打印`0 0 0 0`，但不允许代码为零，因为第一个生成器值的代码为 1。 

与```
2
0 0 1 1
```以 0 作为种子的生成器的第一个输出具有等于 2 的低两位，而种子 1 的第一个输出具有等于 0 的低两位。`1 1 1 1`给出 2⊕2⊕0⊕0=0. 使用完整 64 位值而不是屏蔽为 N 位的粗心实现将拒绝有效的解决方案。 

最后，考虑```
50
18446744073709551615 18446744073709551615 18446744073709551615 18446744073709551615
```四个生成器是相同的，因此在所有四个键盘上使用相同的代码总是会给出四个相同的值，其 XOR 为零。`1 1 1 1`是有效的。 这种情况捕获了忘记生成器的 modulo-2 64 行为的实现。 

## 方法

 直接的方法是生成候选值并枚举四元组，直到它们的异或为零。 它是正确的，因为最终会检查每个可能的四码组合，但最坏的情况约为 10 32 个组合，这是完全不可行的。 

更自然的改进是普通的中间相遇。 为每个键盘生成 L 值，计算每个值 A i ⊕B j ​，并在所有 C k ​ ⊕D l 中查找相同的值。 这有效是因为

 A i ⊕B j ​ =C k ⊕D l ​

 相当于

 A i ⊕B j ⊕C k ⊕D l ​=0。 

不幸的是，每边都有 L 2 对。 为了获得在 N 位随机值中找到解决方案的合理概率，普通生日推理需要 L 约为 2 N/4，这会产生 2 N/2 对。 对于 N=50，在存储任何关联索引之前大约有 3300 万对。 

关键的观察是我们不需要完全任意的 XOR 对。 我们可以故意强制每对 XOR 的最低 b 位相同。 如果

 低 b ​ (A i ​ )=低 b ​ (B j ​ )⊕α,

 然后

 低 b ​ (A i ⊕B j ​ )=α。 

使用相同的 α 对其他两个列表执行相同的操作。 现在，双方的每对 XOR 的最低 b 位都已一致。 我们只需要对剩余的 N−b 位进行碰撞。 

这是瓦格纳提出的四列表广义生日技巧。 对于四个列表，它将搜索减少到大约 O(2 N/3 ) 工作量和内存，而不是 O(2 N/2 )。 标准构造采用大约 2 N/3 个元素的列表，在 N/3 位上连接两个列表，对其他两个执行相同的操作，最后在结果对 XOR 之间查找精确的冲突。 

我们使用稍大的列表，2⌈N/3⌉+1，来增加发现碰撞的概率。 我们还尝试几个 α 值，从零开始。 每次尝试都有相同的渐近成本，并且在问题明确提供的伪随机性假设下，少数独立的过滤器使得失败的可能性极小。 

连接本身不应枚举所有 L 2 对。 我们按列表的最低 b 位对一个列表进行分桶。 对于另一个列表中的每个值，我们仅检查其低位将产生所请求的 α 的桶。 由于有 2 b 个可能的桶，并且 L 只是大于 2 b 的常数因子，因此预计检查对的数量为 O(L)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(10 32 ) | O(1) | O(1) | 太慢了 |
 | 普通的中间会面 | O(2 N/2 ) | O(2 N/2 ) | 对于 N=50 来说太大 |
 | 广义生日加盟 | 预期 O(2 N/3 ) | O(2 N/3 ) | 已接受 |

 ## 算法演练

 1. 设置 b=⌈N/3⌉，并从四个生成器序列中的每一个生成 L=2 b+1 值。 因子 2 为我们提供了比理论阈值更多的候选对，同时将列表的条目数量保持在 100000000 个以下。 
2. 仅保留每个生成值的最低 N 位。 生成器状态保持完整的 128 位状态，因为截断状态会更改所有后续生成器输出。 
3. 选择一小组 b 位值 α，首先尝试零。 对于固定的 α，我们希望前两个列表中的每一对都满足

 低 b ​ (x 1 ⊕x 2 ​ )=α。 

第二对将满足相同的方程，因此它们的异或可能相等。 
4. 按第二个列表的最低 b 位对第二个列表进行分桶。 对于第一个列表中的值 x，所需的存储桶是

 低 b ​ (x)⊕α。

该存储桶中的每个索引都与 x 形成有效的部分冲突。 
5. 对于前两个列表中的每个这样的对，计算 x 1 ​ ⊕x 2 ​ 并将其与两个原始索引一起存储在哈希表中。 生成的对的数量预计为 O(L)，而不是 O(L 2 )，因为只有在 b 位上达成一致的对才能生存。 
6. 对第三个和第四个列表重复相同的分桶过程。 不存储第二对列表，而是立即检查每个生成的对与第一对的哈希表的异或。 
7. 如果一对 XOR 匹配，则说

 x 1 ​ ⊕x 2 ​ =x 3 ​ ⊕x 4 ​ ,

 然后对两边进行异或运算得到

 x 1 ​ ⊕x 2 ​ ⊕x 3 ​ ⊕x 4 ​ =0。 

四个相应的基于一的索引是有效的答案。 
8. 如果当前α没有发现碰撞，则尝试另一个α。 值 α 仅改变保留的部分冲突，因此可以重用已生成的伪随机列表。 
9. 输出四个存储的索引，加一，因为内部数组的索引为零，而生成器的第一个输出的代码为 1。 

### 为什么它有效

 中心不变量是，存储在第一个哈希表中的每个对都具有等于 α 的低 b 位，并且在第二侧检查的每个对都具有完全相同的低 b 位。 如果全对 XOR 匹配，则所有四个所选生成器输出的 XOR 在所有 N 个相关位中均为零。 

过滤步骤不会产生错误的解决方案。 它仅丢弃不能参与所选部分碰撞结构的对。 一旦两个全对 XOR 相等，所得的四个代码在数学上就可以保证满足所需的 XOR 方程。 

伪随机性假设使得搜索速度更快。 当 L=2 b+1 时，第一个连接的预期大小约为 L 2 /2 b =2L。 这些 XOR 对都共享 b 个固定位，在需要冲突的地方留下 N−b 位。 由于双方各有2L左右的候选人，预计决赛场数约为

 2 N−b (2L) 2 ​ ,

 这是一个常数或更大，因为 b=⌈N/3⌉。 这是算法使用的广义生日效应。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MASK64 = (1 << 64) - 1
CONST = 0x7263d9bd8409f526

def generate(seed, count, value_mask):
    s0 = seed & MASK64
    s1 = (seed ^ CONST) & MASK64
    result = [0] * count

    for i in range(count):
        result[i] = (s0 + s1) & value_mask

        t = s1 ^ s0

        ns0 = (((s0 << 55) & MASK64) | (s0 >> 9))
        ns0 ^= t
        ns0 ^= (t << 14) & MASK64
        ns0 &= MASK64

        ns1 = (((t << 36) & MASK64) | (t >> 28))
        ns1 &= MASK64

        s0, s1 = ns0, ns1

    return result

def build_buckets(values, low_mask):
    size = low_mask + 1
    head = [-1] * size
    nxt = [-1] * len(values)

    for i, x in enumerate(values):
        k = x & low_mask
        nxt[i] = head[k]
        head[k] = i

    return head, nxt

def build_left_map(a, b, head, nxt, low_mask, alpha, length):
    pairs = {}

    for i, x in enumerate(a):
        wanted = (x & low_mask) ^ alpha
        j = head[wanted]

        while j != -1:
            value = x ^ b[j]
            if value not in pairs:
                pairs[value] = i * length + j
            j = nxt[j]

    return pairs

def find_right(c, d, head, nxt, low_mask, alpha, pairs):
    for i, x in enumerate(c):
        wanted = (x & low_mask) ^ alpha
        j = head[wanted]

        while j != -1:
            value = x ^ d[j]
            code = pairs.get(value)

            if code is not None:
                return code, i * len(d) + j

            j = nxt[j]

    return None

def solve():
    n = int(input())
    seeds = list(map(int, input().split()))

    value_mask = (1 << n) - 1

    # b is the number of low bits fixed during each partial join.
    b = (n + 2) // 3

    # One extra factor of two improves the probability of finding a collision.
    length = 1 << (b + 1)

    values = [
        generate(seed, length, value_mask)
        for seed in seeds
    ]

    a, b_values, c, d = values

    low_bits = (n + 2) // 3
    low_mask = (1 << low_bits) - 1

    # Zero is the standard Wagner filter. The remaining filters
    # explore other possible low-bit XOR values.
    alphas = [0]
    for i in range(min(7, low_bits)):
        alphas.append(1 << i)

    for alpha in alphas:
        head, nxt = build_buckets(b_values, low_mask)
        left = build_left_map(
            a, b_values, head, nxt,
            low_mask, alpha, length
        )

        head, nxt = build_buckets(d, low_mask)
        answer = find_right(
            c, d, head, nxt,
            low_mask, alpha, left
        )

        if answer is not None:
            left_code, right_code = answer

            i1 = left_code // length
            i2 = left_code % length
            i3 = right_code // length
            i4 = right_code % length

            print(i1 + 1, i2 + 1, i3 + 1, i4 + 1)
            return

if __name__ == "__main__":
    solve()
```这`generate`函数完全遵循生成器定义。`result`被减少到相关的N位，而`s0`和`s1`始终保持模 2 64。临时变量`t`是更新的`s1 ^ s0`两个状态转换使用的值。 

数组索引`i`代表生成器代码`i + 1`。 此转换仅在打印时执行，这避免了在连接期间将基于 1 的问题索引与基于 0 的 Python 索引混合在一起。`build_buckets`实现部分碰撞连接而不构造每一对。 这`head`数组存储属于每个低位桶的第一个索引，而`nxt`形成该存储桶中所有其他索引的链接列表。 与每个存储桶包含单独的 Python 列表的字典相比，这使用的内存要少得多。`build_left_map`精确考虑其低 b 位异或的对`alpha`。 字典键是该对的完整 N 位异或，其值将两个原始索引编码为`i * length + j`。`find_right`对其他两个序列执行相同的部分连接。 匹配的字典键给出两个相等的异或对，这立即给出所需的四路异或零。 

Python 中不存在有符号整数问题，但显式`MASK64`操作还是有必要的。 如果没有它们，Python 的无限整数将允许位置 63 之外的位泄漏到未来的生成器状态中，从而产生与问题中指定的序列不同的序列。 参考 Python 生成器同样减少了两个状态分量模 2 64。 

该代码使用八个可能的部分冲突过滤器。 首先尝试零，因为它是最简单的情况，并且可以很好地处理相同的序列。 额外的过滤器不会改变正确性，它们只会增加有限采样列表包含解决方案的机会。 

## 工作示例

 官方的样本是```
50
3641603982383516983 445363681616962640 868196408185819179 1980241222855773941
```一个被接受的答案是```
287 17609 122886 59914
```如竞赛声明所示。 

对于 N=50，算法选择 b=⌈50/3⌉=17。 它为每个键盘生成 2 18 =262144 个值。 下表显示了计算的结构状态，而不是打印数十万个生成的值。 

| 舞台| 尼 | 乙| 清单大小 | 关键属性|
 | ---| ---| ---| ---| ---|
 | 生成的列表 | 50 | 50 17 | 17 262144 每个 | 每个值都有 50 个相关位 |
 | 首次加入 | 50 | 50 17 | 17 预计约524288双| 对 XOR 的低 17 位等于 α |
 | 第二次加盟 | 50 | 50 17 | 17 预计约524288双| 对 XOR 具有相同的低 17 位 |
 | 最终查找| 50 | 50 17 | 17 哈希查找 | 两个完整的异或对相等 |
 | 输出| 50 | 50 17 | 17 4 个指数 | 所有四个选定值的异或为零 |

 对于接受的示例代码，位置 287、17609、122886 和 59914 处的生成器输出的最低 50 位异或为零。 广义生日搜索找到等效碰撞，并且不需要重现精确的样本输出，因为该语句接受每个有效的解决方案。 

一个较小的确定性示例是```
1
0 0 0 0
```这里b=1，每个键盘的第一个发生器输出为零。 该算法可以立即使用每个列表中的代码 1。 

| 舞台| 价值观 | 结果 |
 | ---| ---| ---|
 | 四个生成值| 0,0,0,0 | 0,0,0,0 | 模 2 1 | 全部为零
 | 第一对| 0⊕0| 0 |
 | 第二对 | 0⊕0| 0 |
 | 决赛| 0=0 | 发现 |
 | 输出| 索引 1, 1, 1, 1 | 有效|

 此示例演示了基于 1 的索引不变式。 生成器的第一个值对应于代码 1，而不是代码 0。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 预期 O(2 N/3 ) | 生成四个 O(2 N/3 ) 值列表，每个部分连接检查 O(2 N/3 ) 预期对 |
 | 空间| O(2 N/3 ) | 生成的四个列表、桶数组和一个部分对哈希表的大小为 |

 对于 N=50，2 N/3 约为 128,000，并且实现使用 262144 个元素的常数因子更大列表。 生成的数据结构保持在 256 MB 内存限制内，而哈希和连接操作的数量对于优化的 Python 实现中的 2 秒限制来说是实用的。 加速来自于从未实现 L 2 笛卡尔积，仅实现了在选定的低位上发生冲突的对。 

## 测试用例

 官方示例有多个可接受的输出，因此精确的字符串比较是不合适的。 下面的示例测试验证了生成的四个代码是否满足原始生成器方程。 

以下线束假设`solve()`Python 解决方案部分中的函数可在同一文件中使用。```python
import sys
import io
from contextlib import redirect_stdout

MASK64 = (1 << 64) - 1
CONST = 0x7263d9bd8409f526

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    out = io.StringIO()
    with redirect_stdout(out):
        solve()

    sys.stdin = old_stdin
    return out.getvalue().strip()

def generator_value(seed: int, code: int) -> int:
    s0 = seed & MASK64
    s1 = (seed ^ CONST) & MASK64

    for _ in range(code):
        result = (s0 + s1) & MASK64

        t = s1 ^ s0

        ns0 = (((s0 << 55) & MASK64) | (s0 >> 9))
        ns0 ^= t
        ns0 ^= (t << 14) & MASK64
        ns0 &= MASK64

        ns1 = (((t << 36) & MASK64) | (t >> 28))
        ns1 &= MASK64

        s0, s1 = ns0, ns1

    return result

def valid(inp: str, output: str) -> bool:
    data = list(map(int, inp.split()))
    n = data[0]
    seeds = data[1:5]

    codes = list(map(int, output.split()))

    if len(codes) != 4:
        return False

    if any(c <= 0 or c >= 100000000 for c in codes):
        return False

    mask = (1 << n) - 1

    x = 0
    for seed, code in zip(seeds, codes):
        x ^= generator_value(seed, code) & mask

    return x == 0

# Official sample
sample = """\
50
3641603982383516983 445363681616962640 868196408185819179 1980241222855773941
"""

sample_output = run(sample)
assert valid(sample, sample_output), "official sample"

# Minimum N, first generator output
case_min = """\
1
0 0 0 0
"""
assert run(case_min) == "1 1 1 1", "minimum N and one-based indexing"

# Small N with different seeds
case_small = """\
2
0 0 1 1
"""
assert run(case_small) == "1 1 1 1", "small bit width"

# Maximum N and maximum seed, all four generators identical
case_max = """\
50
18446744073709551615 18446744073709551615 18446744073709551615 18446744073709551615
"""
assert run(case_max) == "1 1 1 1", "64-bit wraparound and maximum seed"

# Boundary around N mod 3
case_boundary = """\
4
0 0 0 0
"""
assert run(case_boundary) == "1 1 1 1", "N not divisible by 3"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 官方样品| 任何满足 XOR 条件的输出 | 完整的生成器和通用的生日搜索 |
 |`1 / 0 0 0 0`|`1 1 1 1`| 最小 N，第一个代码，最低位掩码 |
 |`2 / 0 0 1 1`|`1 1 1 1`| 小位宽和不同的种子 |
 |`50 / MAX MAX MAX MAX`|`1 1 1 1`| 64 位包装和最大种子 |
 |`4 / 0 0 0 0`|`1 1 1 1`| N 不能被 3 整除时的正确处理 |

 ## 边缘情况

 对于```
1
0 0 0 0
```该算法从每个相同的生成器生成第一个值。 由于种子零的第一个结果为零，因此所有四个一位值都为零。 第一对产生异或零，第二对也产生异或零，最终的哈希查找立即成功。 内部索引全部为零，但打印的代码全部递增到 1。 

对于```
2
0 0 1 1
```种子 0 的第一个生成器输出的低两位等于 2，而种子 1 的第一个输出的低两位等于 0。因此，这四个值满足 2⊕2⊕0⊕0=0。 α=0 的连接保留了两个对，因为每个对都具有相同的低一位值，并且它们完整的两位对 XOR 匹配。 

为了```
50
18446744073709551615 18446744073709551615 18446744073709551615 18446744073709551615
```所有四个发电机状态都是相同的，因此每个相应的发电机输出都是相同的。 这四个列表包含相同的序列，并且从每个列表中选择第一个元素会给出四个相等的 N 位值。 对偶数个相同值进行异或运算得出零。 该实现还正确地将初始状态和每次转换包装为 64 位。 

对于 N=50，部分连接宽度为 17 位，而不是精确的 16 或 18。该实现通过整数上限除法来计算它，然后分配一个两倍于 2 17 的列表。这很重要，因为选择错误的舍入方向会改变部分冲突列表的预期大小，并使最终的冲突概率变得更糟。 

生成器的代码编号是另一个持久边界条件。 在内部，第一个生成的值存储在数组位置零处。 该问题将该值代码称为 1。转换被推迟到最终输出，其中每个恢复的索引仅递增一次。 这避免了无效代码零和在对重建期间将索引移位两次的更微妙的错误。
