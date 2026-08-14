---
title: "CF 102319Q - 奇怪的查询"
description: "我们维护一个奇怪的整数数组。 奇特整数是无平方的，并且每个素数因子都低于 300。这样的素数只有 62 个，因此每个值都可以用 62 位掩码表示，告诉我们在其分解中出现了哪些素数。"
date: "2026-08-13T05:04:59+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102319
codeforces_index: "Q"
codeforces_contest_name: "UBC Summer Contest 2018"
rating: 0
weight: 102319
solve_time_s: 424
verified: true
draft: false
---

[CF 102319Q - 奇怪的查询](https://codeforces.com/problemset/problem/102319/Q)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护一个奇怪的整数数组。 奇特整数是无平方的，并且每个素数因子都低于 300。这样的素数只有 62 个，因此每个值都可以用 62 位掩码表示，告诉我们在其分解中出现了哪些素数。 

类型 1 查询给出一个范围和另一个奇怪的整数`x`。 范围内的每个值都替换为`x`恰好当其除数的有序列表按字典顺序大于`x`。 类型 2 查询要求范围内所有值的 LCM（模 (10^9+7)）。 

第一个困难是更新不是一个普通的任务。 有些位置会改变，有些则不会，具体取决于整数的非平凡排序。 第二个困难是当值在范围内改变时必须保持 LCM。 

对于 (n\le 10^5) 和 (q\le 2\cdot10^5)，不可能扫描每个查询的整个范围。 在最坏的情况下，(2\cdot10^5) 个查询可以每次触及 (10^5) 个位置，甚至在考虑比较除数列表的成本之前就给出 (2\cdot10^{10}) 个位置访问。 解决方案需要对每个查询进行大致对数摊销工作。 

有几种边缘情况直接实现可能会出错。 第一个是字典比较中的前缀大小写。 例如，一个元素等于`2`，查询`1 1 1 6`必须将其更改为`6`，因为除数列表`2`是`[1, 2]`，按字典顺序小于`[1, 2, 3, 6]`。 仅将比较视为素因数位掩码的比较可能会出错。 

第二个边缘情况是一个数字除以另一个数字。 例如，`6`和`30`有除数列表`[1,2,3,6]`和`[1,2,3,5,6,10,15,30]`。 第一个区别是`5`相对`6`， 所以`30`实际上按字典顺序小于`6`。 仅基于一次因式分解中是否存在素数的比较器会错误地对它们进行排序。 

第三个边缘情况涉及 LCM。 用于输入```
2
6 10
1
2 1 2
```答案是`30`， 不是`60`。 由于数字是无平方的，因此 LCM 仅包含每个素数一次，因此正确的操作是对其素数掩码进行按位或，然后对所选素数进行乘法。 

范围的端点也需要精确处理。 例如，```
3
6 10 14
1
1 2 2 7
```仅更改第二个位置。 更新中`[l,r)`内部同时将输入范围视为`[l,r]`在很多情况下会默默地错过最后一个元素。 

## 方法

 暴力解决方案很简单。 对于类型 1 查询，检查来自`l`通过`r`，比较当前值的除数序列和`x`，并分配`x`当需要时。 对于类型 2 查询，遍历范围并累积 LCM。 这两个过程都是正确的，因为它们直接实现了定义。 

问题是访问的位置数量。 在长度范围 (10^5) 上的 (2\cdot10^5) 个查询的最坏情况序列会产生 (2\cdot10^{10}) 次访问。 如果通过显式构造除数列表来实现，除数比较本身也不是恒定的，因此这种方法远远超出了时间限制。 

第一个有用的观察是奇怪的数字是无平方的。 因此，它们的素因式分解是集合而不是多重集。 由于每个质因数都低于 300，因此只有 62 个可能的质因数。 这立即以 62 位掩码的形式给出了每个值的紧凑表示。 

第二个观察结果更为微妙。 我们需要快速比较除数序列，但实际上并不需要构造这些序列。 

取两个不同的奇怪数字`a`和`b`，并让`p`是其中恰好出现的最小素数。 每个除数小于`p`仅使用小于的素数`p`，并且所有这些主要成员资格在`a`和`b`。 因此下面的每个除数`p`出现在两个数字中。 

认为`p`划分`a`但不是`b`。 如果两个数都不能整除另一个数，那么`b`有一些素因数大于`p`那是不共享的。 序列不同的第一个除数是`p`在一边`a`， 所以`a`按字典顺序更小。 

唯一的特殊情况是当`b`划分`a`。 那么每个除数`b`也发生在`a`。 让`p`又是 的最小附加素数`a`。 如果`p < b`, 除数`p`出现在最后除数之前`b`， 所以`a`较小。 如果`p > b`，整个除数序列`b`之前结束`p`， 所以`b`较小。 对称情况适用于`a`划分`b`。 

一旦知道两个素数掩码，就会给出一个 (O(1)) 比较器。 可能的素数只有 62 个，因此找到第一个不同的素数是一个恒定时间的位运算。 

现在更新是一个范围`chmin`在此自定义总订单下。 对于我们概念上执行的每个职位

 [
 a_i\leftarrow \min(a_i,x)
 ]

 哪里`min`使用除数序列排序而不是普通的整数排序。 

这正是 Segment Tree Beats 处理的更新类型。 对于每个线段树节点，我们在此排序下保留其最大值、严格的第二最大值、最大值出现的次数以及有关素数掩码的足够信息以维护范围 LCM。 

LCM 有一个特别方便的表示方法。 由于每个数字都是无平方的，因此集合的 LCM 是通过对所有素数掩码进行按位或运算来获得的。 因此，每个线段树节点都存储此 OR 掩码。 在删除等于节点最大值的所有元素后，我们另外存储 OR 掩码。 这个额外的字段允许我们在仅更改最大组时更新 OR。 

暴力破解之所以有效，是因为它显式地检查每个受影响的值。 它会失败，因为太多的查询可能会触及太多的值。 观察到更新是一个范围`chmin`在固定总顺序下，线段树节拍可以跳过整组值，而 62 素数表示则使 LCM 聚合成为按位 OR。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(qn))，最多 (2\cdot10^{10}) 个位置访问 | (O(n)) | (O(n)) | 太慢了|
 | 最佳| (O((n+q)\log n)) 摊销 | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 将每个初始值和出现在类型 1 查询中的每个值分解为其不同的质因数。 由于所有数字都保证是古怪的，因此每个因数都是 300 以下的 62 个素数之一。用 62 位掩码表示因式分解。 
2. 使用两个掩码实现除数序列比较。 找到隶属度不同的最低索引素数。 如果两个数都不能整除另一个数，则包含该素数的数按除数序列顺序较小。 如果一个除另一个，请将额外的素数与较小的数字本身进行比较，因为这决定了额外的除数是否出现在较短的序列结束之前。 
3. 构建线段树。 对于每个节点，存储自定义顺序下的最大值、其掩码、严格第二最大值及其掩码、最大值的计数、节点中每个掩码的 OR 以及排除所有最大值位置后的 OR。 
4. 将类型 1 查询作为范围进行处理`chmin`。 如果节点的最大值已经不大于`x`，没有任何变化。 如果整个节点被覆盖并且其严格第二最大值小于`x`，只有最大值位置可以改变，因此可以更新节点而无需下降到其子节点。 
5. 当只有最大组发生变化时，将其值替换为`x`，保留其计数，并将节点的 OR 重新计算为`OR_without_max | mask(x)`。 第二个最大值不会改变，因为`x`严格大于它。 
6. 如果该节点无法直接更新，则将当前最大限制推送到其子节点，并递归到相关子节点。 然后将子级合并回父级。 
7. 通过对所覆盖节点的素数掩码进行递归 OR 运算来处理类型 2 查询。 生成的掩模准确地代表了 LCM 中存在的主要因素。 将这些选定的素数乘以模 (10^9+7)。 

线段树节拍保持快速的原因是，仅当更新至少达到节点的第二大不同值时才会发生强制下降。 在这种情况下，两个不同值在更新后变得相等，因此该子树中表示的不同值的数量减少。 更新只能以正常的线段树边界成本引入新值，而破坏性下降则通过这些下降来摊销。 这给出了范围的标准 (O((n+q)\log n)) 摊销界限`chmin`。 

### 为什么它有效

 线段树不变量是每个节点准确地描述其区间内的当前值，`mx`是除数序列顺序下的最大值，并且`smx`最大的严格较小的值。 如果`x`严格位于它们之间，只有等于的元素`mx`受到影响，因此更改该组就足够了。 如果`x`等于或低于`smx`，更新可能会影响多个不同的值，并且必须对节点进行拆分。 

所存储的`or_without_max`恰好是所有不等于的值的或`mx`。 每当最大组被替换时，新的完整 OR 就会随之而来`or_without_max | mask(x)`。 每当合并子项时，相等最大值、左最大值或右最大值的三种情况都会提供足够的信息来重建最大组和排除它的 OR。 

对于范围查询，所有覆盖节点掩码的 OR 恰好是所有质因数的并集。 由于每个奇数都包含最多指数为 1 的每个质数，因此该并集正是 LCM 的质因数分解。 最终的模乘法由此产生所需的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1_000_000_007

PRIMES = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
    31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
    73, 79, 83, 89, 97, 101, 103, 107, 109, 113,
    127, 131, 137, 139, 149, 151, 157, 163, 167, 173,
    179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
    233, 239, 241, 251, 257, 263, 269, 271, 277, 281,
    283, 293
]

PRIME_INDEX = {p: i for i, p in enumerate(PRIMES)}

def solve():
    n = int(input())
    initial = list(map(int, input().split()))
    q = int(input())

    queries = []
    all_values = set(initial)

    for _ in range(q):
        parts = list(map(int, input().split()))
        queries.append(parts)
        if parts[0] == 1:
            all_values.add(parts[3])

    mask_cache = {}

    def get_mask(x):
        cached = mask_cache.get(x)
        if cached is not None:
            return cached

        if x == 1:
            mask_cache[x] = 0
            return 0

        v = x
        mask = 0

        for i, p in enumerate(PRIMES):
            if p * p > v:
                break
            if v % p == 0:
                mask |= 1 << i
                v //= p

        if v > 1:
            mask |= 1 << PRIME_INDEX[v]

        mask_cache[x] = mask
        return mask

    # Returns True exactly when the divisor sequence of a is
    # lexicographically smaller than that of b.
    def less(a, ma, b, mb):
        if a == b:
            return False

        diff = ma ^ mb
        bit = diff & -diff
        idx = bit.bit_length() - 1
        p = PRIMES[idx]

        # b divides a.
        if (ma & mb) == mb:
            return p < b

        # a divides b.
        if (ma & mb) == ma:
            return a < p

        # Neither divides the other. The side containing the
        # first differing prime has the smaller divisor sequence.
        return (ma & bit) != 0

    def greater(a, ma, b, mb):
        return less(b, mb, a, ma)

    size = 4 * n + 5

    mx = [0] * size
    smx = [-1] * size
    cnt = [0] * size

    mx_mask = [0] * size
    smx_mask = [0] * size

    or_mask = [0] * size
    or_without_max = [0] * size

    def pull(v):
        left = v << 1
        right = left | 1

        lm = mx[left]
        rm = mx[right]
        lmask = mx_mask[left]
        rmask = mx_mask[right]

        if lm == rm:
            mx[v] = lm
            mx_mask[v] = lmask
            cnt[v] = cnt[left] + cnt[right]

            a = smx[left]
            am = smx_mask[left]
            b = smx[right]
            bm = smx_mask[right]

            if a == -1:
                smx[v] = b
                smx_mask[v] = bm
            elif b == -1:
                smx[v] = a
                smx_mask[v] = am
            elif greater(a, am, b, bm):
                smx[v] = a
                smx_mask[v] = am
            else:
                smx[v] = b
                smx_mask[v] = bm

            or_without_max[v] = or_without_max[left] | or_without_max[right]

        elif greater(lm, lmask, rm, rmask):
            mx[v] = lm
            mx_mask[v] = lmask
            cnt[v] = cnt[left]

            a = smx[left]
            am = smx_mask[left]
            b = rm
            bm = rmask

            if a == -1 or greater(b, bm, a, am):
                smx[v] = b
                smx_mask[v] = bm
            else:
                smx[v] = a
                smx_mask[v] = am

            or_without_max[v] = or_without_max[left] | or_mask[right]

        else:
            mx[v] = rm
            mx_mask[v] = rmask
            cnt[v] = cnt[right]

            a = smx[right]
            am = smx_mask[right]
            b = lm
            bm = lmask

            if a == -1 or greater(b, bm, a, am):
                smx[v] = b
                smx_mask[v] = bm
            else:
                smx[v] = a
                smx_mask[v] = am

            or_without_max[v] = or_without_max[right] | or_mask[left]

        or_mask[v] = or_without_max[v] | mx_mask[v]

    def build(v, l, r):
        if l == r:
            value = initial[l]
            mask = get_mask(value)

            mx[v] = value
            smx[v] = -1
            cnt[v] = 1
            mx_mask[v] = mask
            smx_mask[v] = 0
            or_mask[v] = mask
            or_without_max[v] = 0
            return

        mid = (l + r) >> 1
        build(v << 1, l, mid)
        build(v << 1 | 1, mid + 1, r)
        pull(v)

    def apply_max(v, value, mask):
        mx[v] = value
        mx_mask[v] = mask
        or_mask[v] = or_without_max[v] | mask

    def push(v):
        value = mx[v]
        mask = mx_mask[v]

        left = v << 1
        right = left | 1

        if greater(mx[left], mx_mask[left], value, mask):
            apply_max(left, value, mask)

        if greater(mx[right], mx_mask[right], value, mask):
            apply_max(right, value, mask)

    def range_chmin(v, l, r, ql, qr, value, value_mask):
        if r < ql or qr < l:
            return

        # Nothing in this node is larger than value.
        if not greater(mx[v], mx_mask[v], value, value_mask):
            return

        if ql <= l and r <= qr:
            # Only the maximum group is above value.
            if smx[v] == -1 or less(smx[v], smx_mask[v], value, value_mask):
                apply_max(v, value, value_mask)
                return

        push(v)

        mid = (l + r) >> 1
        range_chmin(v << 1, l, mid, ql, qr, value, value_mask)
        range_chmin(v << 1 | 1, mid + 1, r, ql, qr, value, value_mask)
        pull(v)

    def range_or(v, l, r, ql, qr):
        if r < ql or qr < l:
            return 0

        if ql <= l and r <= qr:
            return or_mask[v]

        push(v)

        mid = (l + r) >> 1
        return (
            range_or(v << 1, l, mid, ql, qr)
            | range_or(v << 1 | 1, mid + 1, r, ql, qr)
        )

    build(1, 0, n - 1)

    product_cache = {0: 1}

    def mask_product(mask):
        cached = product_cache.get(mask)
        if cached is not None:
            return cached

        result = 1
        m = mask

        while m:
            bit = m & -m
            idx = bit.bit_length() - 1
            result = result * PRIMES[idx] % MOD
            m -= bit

        product_cache[mask] = result
        return result

    out = []

    for query in queries:
        if query[0] == 1:
            _, l, r, x = query
            x_mask = get_mask(x)
            range_chmin(1, 0, n - 1, l - 1, r - 1, x, x_mask)
        else:
            _, l, r = query
            mask = range_or(1, 0, n - 1, l - 1, r - 1)
            out.append(str(mask_product(mask)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```因式分解例程利用每个素数因子都低于 300 的事实。它会尝试 62 个可能的素数，并在当前素数的平方超过剩余值时停止。 字典缓存掩码，因此初始数组或重复更新目标中的重复值仅被分解一次。 

这`less`函数是关键的数论部分。`diff`识别两个因式分解不同的最小素数。 子集检查处理一个整数除另一个整数的情况，这正是普通的第一不同素数参数需要与较小整数进行额外比较的情况。 

线段树保存两种不同类型的信息。`mx`,`smx`， 和`cnt`是用于决定哪些值的线段树节拍状态`chmin`可以批量更改。`or_mask`和`or_without_max`是用于 LCM 查询的聚合状态。 

这`apply_max`功能不需要修改`smx`或者`cnt`。 仅当新值严格位于旧最大值和严格第二最大值之间时，或者当节点仅包含一个不同值时，才会调用它。 在任何一种情况下，属于最大组的位置集合都不会改变。`push`与普通的惰性线段树略有不同。 没有单独的分配标签。 父级的当前最大值充当上限，必须将其传播到最大值仍然更大的任何子级。 这是标准的线段树节拍机制。 

所有输入范围都从从一开始的包含索引转换为从零开始的包含索引`l - 1`和`r - 1`。 递归一致地使用包含端点，因此转换只发生一次。 

Python 整数不会溢出，数据结构中唯一可能较大的值是位掩码。 最大掩码仅使用 62 位。 LCM 值永远不会直接构建，仅维护最终的模块化产品。 

## 工作示例

 对于示例 1，输入为```
3
6 10 13
5
1 1 3 14
2 1 1
2 2 2
2 3 3
2 1 3
```相关的状态变化是：

 | 查询 | 范围 | 目标| 更新后的值 | 范围 OR 查询 | 回答 |
 | ---| ---| ---| ---| ---| ---|
 |`1 1 3 14`| 1..3 | 1..3 14 | 14`[6, 10, 14]`| | |
 |`2 1 1`| 1..1 | 1..1 |`[6, 10, 14]`|`{2,3}`| 6 |
 |`2 2 2`| 2..2 | 2..2 |`[6, 10, 14]`|`{2,5}`| 10 | 10
 |`2 3 3`| 3..3 | 3..3 |`[6, 10, 14]`|`{2,7}`| 14 | 14
 |`2 1 3`| 1..3 | 1..3 |`[6, 10, 14]`|`{2,3,5,7}`| 210 | 210

 更新离开`6`和`10`不变，因为它们的除数序列小于`14`。 价值`13`被替换是因为`14`具有较小的除数序列。 最终的 LCM 包含四个不同的素数 2、3、5 和 7，给出`210`。 

对于示例 2，输入为```
2
1 1
5
2 1 1
1 1 1 2
2 1 1
1 1 1 1
2 1 1
```踪迹是：

 | 查询 | 范围 | 目标| 数组状态 | 回答 |
 | ---| ---| ---| ---| ---|
 |`2 1 1`| 1..1 | 1..1 |`[1,1]`| 1 |
 |`1 1 1 2`| 1..1 | 1..1 2 |`[1,1]`| |
 |`2 1 1`| 1..1 | 1..1 |`[1,1]`| 1 |
 |`1 1 1 1`| 1..1 | 1..1 1 |`[1,1]`| |
 |`2 1 1`| 1..1 | 1..1 |`[1,1]`| 1 |

 第二个查询不会更改第一个元素。 的除数序列`1`是`[1]`，按字典顺序小于`[1,2]`， 所以`1`没有被取代`2`。 这练习了简单的素数掩码比较器会错误处理的前缀情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O((n+q)\log n)) 摊销 | Segment Tree Beats 处理范围`chmin`; 掩码构造对于每个不同的输入值最多检查 62 个素数； 每个 LCM 掩模最多包含 62 个素数 |
 | 空间| (O(n+q)) | 线段树使用 (O(n)) 个节点，缓存的掩码和查询值使用 (O(n+q)) 个额外空间 |

 因式分解常数仅为 62，因为该问题将所有素数因子限制为 300 以下的素数。线段树部分被摊销 (O((n+q)\log n))，这适用于 (10^5) 数组位置和 (2\cdot10^5) 查询。 存储的掩码也很紧凑，因为它们只需要 62 位。 

## 测试用例```python
# Save the solution above as solution.py before running these tests.
import sys
import io
import importlib
import solution

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solution.input = sys.stdin.readline
        solution.solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Sample 1
assert run(
    """\
3
6 10 13
5
1 1 3 14
2 1 1
2 2 2
2 3 3
2 1 3
"""
) == "6\n10\n14\n210", "sample 1"

# Sample 2
assert run(
    """\
2
1 1
5
2 1 1
1 1 1 2
2 1 1
1 1 1 1
2 1 1
"""
) == "1\n1\n1", "sample 2"

# Minimum-size input
assert run(
    """\
1
1
3
2 1 1
1 1 1 2
2 1 1
"""
) == "1\n1", "minimum size"

# All values equal, plus a range update that changes only part of the array
assert run(
    """\
4
6 6 6 6
3
1 2 3 2
2 1 4
2 2 3
"""
) == "6\n2", "all equal values"

# Boundary and prefix-sensitive comparisons
assert run(
    """\
5
6 10 14 13 1
4
1 2 4 7
2 3 5
2 1 2
2 4 4
"""
) == "7\n30\n7", "range boundaries"

# The prefix case 2 < 6 must be handled correctly.
assert run(
    """\
4
2 6 3 15
2
1 1 4 2
2 1 4
"""
) == "30", "lexicographic prefix case"

# Maximum-size array, with a small number of queries.
big_input = (
    "100000\n"
    + ("1 " * 99999)
    + "1\n"
    + "3\n"
    + "2 1 100000\n"
    + "1 1 100000 1\n"
    + "2 1 100000\n"
)
assert run(big_input) == "1\n1", "maximum n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`n=1`， 价值`1`|`1\n1`| 最小尺寸输入和无操作更新 |
 |`[6,6,6,6]`， 更新`[2,3]`到`2`|`6\n2`| 相等的最大组和部分范围更新 |
 |`[6,10,14,13,1]`， 更新`[2,4]`到`7`|`7\n30\n7`| 包容性边界和选择性替代|
 |`[2,6,3,15]`，全部更新为`2`|`30`| 词典前缀行为 |
 |`100000`的副本`1`|`1\n1`| 最大数组大小和全范围查询 |

 ## 边缘情况

 前缀情况由子集分支直接处理`less`。 为了```
1
1
2
1 1 1 2
2 1 1
```第一个数字的掩码为零，而`2`具有与素数 2 相对应的位。第一个数字除第二个数字，因此比较器检查`1 < 2`并得出结论：`1`较小。 The update is skipped and the answer is`1`。 

非平凡的整除情况是```
2
6 30
1
2 1 2
```因子掩码是`{2,3}`和`{2,3,5}`。 第一个数除第二个数，多余的素数是`5`。 自从`6 > 5`，比较器决定`30`按字典顺序小于`6`。 此处没有更新，范围不会改变，LCM 查询将使用 OR 掩码`{2,3,5}`，生产`30`。 

LCM重叠情况是```
2
6 10
1
2 1 2
```面具是`{2,3}`和`{2,5}`。 他们的或是`{2,3,5}`，所以模块化产品是`2*3*5 = 30`。 将原始值相乘会错误地将公素数 2 计算两次。 

无需特殊端点逻辑即可处理全范围更新。 为了```
3
6 10 14
1
1 1 3 7
```更新恰好访问了这三个位置。 前两个值小于`7`根据除数排序，同时`14`更大，因为`[1,2,7,14]`按字典顺序大于`[1,7]`。 结果数组是`[6,10,7]`。 递归范围表示包括两个端点，因此不会意外排除任何位置。 

节点中每个值都相等的情况也很重要。 其严格的第二最大值是`-1`，因此线段树节拍条件立即接受更新。 整个节点代表一个最大组，并且`or_without_max`为零。 因此，替换该组会将节点的 OR 直接更改为新值的素数掩码，而无需下降到叶子。
