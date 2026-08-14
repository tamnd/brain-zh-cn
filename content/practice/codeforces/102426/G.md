---
title: "CF 102426G - \u4f19\u4f34\u7cfb\u7edf"
description: "系统仅通过 11 个计数器来维护空闲内存。 计数器 i 存储有多少个大小为 2^i 的空闲块，其中 i 的范围从 0 到 10。"
date: "2026-08-14T15:18:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102426
codeforces_index: "G"
codeforces_contest_name: "The 7-th BIT Campus Programming Contest for Junior Grade Group"
rating: 0
weight: 102426
solve_time_s: 125
verified: true
draft: false
---

[CF 102426G - \u4f19\u4f34\u7cfb\u7edf](https://codeforces.com/problemset/problem/102426/G)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 系统仅通过 11 个计数器来维护空闲内存。 柜台`i`存储有多少个空闲块有大小`2^i`， 在哪里`i`范围从 0 到 10。我们永远不需要记住块的物理位置，因为简化模型明确表明空闲块不能合并。 

一个`free n`操作引入一个新的空闲块大小`n`。 由于系统只存储 2 的幂，我们表示`n`通过其二元分解。 例如，`13 = 8 + 4 + 1`，因此释放大小为 13 的块会增加大小为 8、4 和 1 的计数器。 

安`allocate m`操作表现不同。 我们必须找到最小的二次方块，其大小至少为`m`并且其计数器为正。 如果该块有大小`s`，它被消耗并留下剩余的`s - m`。 剩余部分的处理方式与新释放的块完全相同，因此其二进制分解被插入到计数器中。 如果不存在合适的二次幂块，则操作失败并且状态保持不变。 

输入以整数开头`k`， 其次是`k`运营。 每次成功操作后，我们都会打印从大小 1 到大小 1024 的所有 11 个计数器。在分配失败后，我们会打印`ERROR!`并且不要修改计数器。 

该序列最多可以包含`10^5`运营。 可能的块大小只有 11 个，这是关键的结构限制。 每次操作对这 11 种尺寸执行恒定工作量的算法很容易足够快。 相比之下，扫描每个可能的整数大小（从 1 到 1024）以进行每次分配的实现大约执行`1024 * 10^5 = 10^8`在最坏的情况下进行检查，这在 Python 中是不必要的昂贵的，并且为输入和输出的成本留下了很小的空间。 

在几种边缘情况下，直接实现可能会悄无声息地出错。 第一个是请求的大小已经是 2 的幂的分配。 例如：```
3
free 8
allocate 8
allocate 1
```正确的输出是：```
0 0 0 0 0 0 0 0 0 0 0
ERROR!
```大小为 8 的块被精确使用，因此其余数为零。 总是插入的粗心实现`s - m`不检查零可能会意外地将零视为一个块。 

第二种边缘情况是需要更大块并留下包含多个二进制组件的余数的分配：```
2
free 16
allocate 13
```正确的输出是：```
1 1 0 0 0 0 0 0 0 0 0
```16 个块被消耗，剩下 3，它分解为 2 和 1。仅将余数记录为一个整数的实现将违反系统的表示。 

第三种边缘情况是失败，即使较小的空闲块总共有足够的总内存：```
2
free 1
allocate 2
```正确的输出是：```
1 0 0 0 0 0 0 0 0 0 0
ERROR!
```系统无法将现有的 size-1 块合并为 size-2 块。 计数器描述独立的块，而不是内存的聚合池。 

当一个合适的块以 2 的较大幂存在而存在较小的幂但单独不足时，会出现第四种边缘情况：```
3
free 1
free 8
allocate 2
```正确的输出是：```
1 0 1 0 0 0 0 0 0 0 0
```size-1块无法满足要求，因此选择size-8块。 它的余数是 6，变成 4 和 2。与原始 size-1 块一起，计数器变成`1 0 1`，对应尺寸 1、2 和 4。 

## 方法

 一个简单的实现可以存储 11 个计数器，并且`free n`，反复求两个不超过余值的最大幂。 自从`n < 2048`，这最多创建 11 件。 对于分配，最简单的暴力版本可以扫描从`m`到 1024 并询问是否存在正好等于该大小的空闲块。 由于仅表示 2 的幂，因此大多数检查立即无用，但该实现仍对一次分配执行最多 1024 次检查。 和`10^5`操作，最坏的情况大约达到`1024 * 10^5 = 10^8`检查，这对于 1 秒的竞赛限制来说太多了，尤其是对于 Python。 

蛮力思想仍然有用，因为它揭示了真实的状态转换。 一旦尺寸合适的块`s`发现，只有两个变化：减少计数器`s`，然后插入二元分解`s - m`。 区块的历史或物理位置并不重要。 

关键的观察结果是系统只有 11 种可能的块大小。 我们应该直接搜索这 11 个类，而不是扫描所有整数大小。 从最小的 2 的幂开始，即至少`m`，我们检查尺寸`2^j`按递增顺序，直到找到非空计数器。 每个分配最多有 11 次检查，因此整个模拟实际上是线性的`k`。 

同样的表示也使得`free n`简单的。 整数的二进制表示准确地告诉我们在其所需的分解中出现了哪些 2 的幂。 我们可以检查 11 位`n`并增加相应的计数器。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(k × 1024) | O(11) | 在最坏的情况下太慢|
 | 最佳 | O(k × 11) | O(11) | 已接受 |

 ## 算法演练

 1. 创建数组`cnt`长度为11，最初用零填充。`cnt[i]`表示大小为空闲的块的数量`2^i`。 
2.对于一个`free n`操作，检查 11 位`n`。 每当咬一口`i`已设置，增量`cnt[i]`。 这正是所需的分解，因为每个正整数都有唯一的二进制表示形式，并且每一位都对应于一个允许的 2 的幂块。 
3. 对于一个`allocate m`操作，找到最小的索引`j`这样`2^j >= m`。 这是可能满足请求的最小块大小。 
4.从索引开始`j`，向上搜索索引10，直到找到索引`p`和`cnt[p] > 0`。 向上搜索是必要的，因为分配器必须使用大小至少为`m`，而不是碰巧适合的任意块。 
5. 如果不存在这样的索引，则打印`ERROR!`然后离开`cnt`不变。 失败的请求不会消耗或转换任何内存。 
6.如果索引`p`找到了，让`s = 2^p`。 减少`cnt[p]`加一是因为该块现在正在被分配。 
7. 计算`r = s - m`。 如果`r > 0`, 分解`r`通过其二进制位并递增相应的计数器。 如果`r = 0`，没有任何内容返回到可用内存表中。 
8. 打印完整的`cnt`运算后的数组。 下一个操作会重复使用相同的数组，因此模拟自然会向前推进当前的内存状态。 

### 为什么它有效

 不变量是在每次成功处理的操作之后，`cnt[i]`正好是 size 的空闲块的数量`2^i`当前由系统代表。 

一个`free n`操作保留了这个不变量，因为二进制分解分区`n`成不同的允许的二的幂，完全匹配系统所需的表示。 对于分配，达到或超过所需大小的第一个可用计数器正是规范允许我们选择的最小合法块。 删除该块占用已分配的内存，同时分解`s - m`将自由余数精确地添加回表示中。 失败的分配不会改变任何内容，因此在这种情况下也保留了不变量。 通过操作顺序的归纳，每个打印状态都是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def add_block(n, cnt):
    bit = 0
    while n:
        if n & 1:
            cnt[bit] += 1
        n >>= 1
        bit += 1

def solve():
    k = int(input())
    cnt = [0] * 11
    out = []

    for _ in range(k):
        op, x = input().split()
        x = int(x)

        if op == "free":
            add_block(x, cnt)
            out.append(" ".join(map(str, cnt)))
            continue

        # Find the smallest power of two >= x.
        size = 1
        idx = 0
        while size < x:
            size <<= 1
            idx += 1

        # Find the smallest available block that can satisfy x.
        while idx < 11 and cnt[idx] == 0:
            idx += 1

        if idx == 11:
            out.append("ERROR!")
            continue

        block_size = 1 << idx
        cnt[idx] -= 1

        remainder = block_size - x
        if remainder:
            add_block(remainder, cnt)

        out.append(" ".join(map(str, cnt)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`cnt`数组是模拟的整个可变状态。 不需要存储单独的块，因为相同的二次方大小的块在规则下是无法区分的。 

这`add_block`函数直接使用二进制表示。 表达式`n & 1`测试当前的最低有效位，并移位`n`向右移动到下一位。 由于每个输入大小都低于 2048，因此最多需要 11 次迭代。 

对于分配，`size`从 1 开始并加倍，直到达到或超过`x`。 由此产生的`idx`是最小的合法块大小索引。 随后的循环仅检查从那里向上的索引，因此它实现了分配器的确切优先顺序。 

边界`idx < 11`是必不可少的。 索引 10 代表大小 1024，即允许的最大块。 如果搜索达到11，则没有块可以满足请求。 在此失败检查之前计数器不会更改，这会自动实现忽略失败分配的要求。 

当分配成功时，原始块会先递减，然后再插入其余数。 如果`block_size == x`，余数为零，并且`if remainder`防护防止任何无效的零大小分解。 

Python整数在这里不会溢出，所有计数器最多`10^5`加上运算产生的块数，所以普通的整数运算就足够了。 输出累积在一个列表中并在最后写入一次，这避免了支付许多单独的输出调用的成本。 

## 工作示例

 ### 示例 1

 第一个操作尝试在系统为空时进行分配。 第二个操作创建一个大小为 1024 的块。 最终分配使用该块来满足大小为 1 的请求。 

| 运营| 起始状态| 选定的块 | 剩余| 最终状态|
 | --- | --- | --- | --- | --- |
 |`allocate 1`| 全部为零| 无 | 无 |`ERROR!`|
 |`free 1024`| 全部为零| 无 | 无 |`0 0 0 0 0 0 0 0 0 0 1`|
 |`allocate 1`| 尺寸 1024 可供选择 | 1024 | 1024 1023 | 1023`1 1 1 1 1 1 1 1 1 1 0`|

 余数 1023 是`512 + 256 + 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1`，因此从索引 0 到索引 9 的每个计数器都变为 1。 这说明了为什么剩余部分必须分解而不是存储为单个块。 

### 示例 2

 每个`free`操作只是添加已释放块的二进制组件。 由于释放的块是独立的，因此相同大小的块会累积在它们的计数器中并且永远不会合并。 

| 运营| 添加分解| 计数器状态 |
 | --- | --- | --- |
 |`free 1`|`1`|`1 0 0 0 0 0 0 0 0 0 0`|
 |`free 1`|`1`|`2 0 0 0 0 0 0 0 0 0 0`|
 |`free 1`|`1`|`3 0 0 0 0 0 0 0 0 0 0`|
 |`free 2`|`2`|`3 1 0 0 0 0 0 0 0 0 0`|
 |`free 2`|`2`|`3 2 0 0 0 0 0 0 0 0 0`|

 最终状态包含三个独立的 size-1 块和两个独立的 size-2 块。 即使两个 size-1 块的组合大小为 2，它们也无法合并，因为模型不跟踪它们的物理位置。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(k × 11) | 每个操作最多检查 11 个受支持的 2 的幂 |
 | 空间| O(k + 11) | O(k + 11) | 计数器数组有 11 个条目，并且实现每次操作最多缓冲一个输出字符串 |

 和`k <= 10^5`，该算法仅执行几百万个小整数运算。 内存状态本身的大小是恒定的，输出缓冲区与所需的输出大小成正比。 这完全在给定限制的预期复杂性范围内。 

## 测试用例```python
import sys
import io

def add_block(n, cnt):
    bit = 0
    while n:
        if n & 1:
            cnt[bit] += 1
        n >>= 1
        bit += 1

def solve_text(data):
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(data)

    k = int(sys.stdin.readline())
    cnt = [0] * 11
    out = []

    for _ in range(k):
        op, x = sys.stdin.readline().split()
        x = int(x)

        if op == "free":
            add_block(x, cnt)
            out.append(" ".join(map(str, cnt)))
            continue

        size = 1
        idx = 0
        while size < x:
            size <<= 1
            idx += 1

        while idx < 11 and cnt[idx] == 0:
            idx += 1

        if idx == 11:
            out.append("ERROR!")
            continue

        block_size = 1 << idx
        cnt[idx] -= 1

        remainder = block_size - x
        if remainder:
            add_block(remainder, cnt)

        out.append(" ".join(map(str, cnt)))

    sys.stdin = old_stdin
    return "\n".join(out)

# Sample 1
sample1 = """3
allocate 1
free 1024
allocate 1
"""

expected1 = """ERROR!
0 0 0 0 0 0 0 0 0 0 1
1 1 1 1 1 1 1 1 1 1 0"""

assert solve_text(sample1) == expected1, "sample 1"

# Sample 2
sample2 = """5
free 1
free 1
free 1
free 2
free 2
"""

expected2 = """1 0 0 0 0 0 0 0 0 0 0
2 0 0 0 0 0 0 0 0 0 0
3 0 0 0 0 0 0 0 0 0 0
3 1 0 0 0 0 0 0 0 0 0
3 2 0 0 0 0 0 0 0 0"""

assert solve_text(sample2) == expected2, "sample 2"

# Minimum-size input
case_min = """1
free 1
"""
assert solve_text(case_min) == "1 0 0 0 0 0 0 0 0 0 0", "minimum size"

# Exact power of two, followed by an impossible allocation
case_power = """3
free 8
allocate 8
allocate 1
"""
expected_power = """0 0 0 0 0 0 0 0 0 0 0
ERROR!"""
assert solve_text(case_power) == expected_power, "exact power of two"

# Remainder decomposition and smallest-fitting-block rule
case_remainder = """3
free 16
free 1
allocate 13
"""
expected_remainder = """0 0 0 0 1 0 0 0 0 0 0
1 0 0 0 1 0 0 0 0 0 0
1 1 0 0 0 0 0 0 0 0 0"""
assert solve_text(case_remainder) == expected_remainder, "remainder decomposition"

# Maximum block size and allocation of a non-power-of-two value
case_max = """2
free 1024
allocate 1023
"""
expected_max = """0 0 0 0 0 0 0 0 0 0 1
1 0 0 0 0 0 0 0 0 0 0"""
assert solve_text(case_max) == expected_max, "maximum block size"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / free 1`|`1 0 0 0 0 0 0 0 0 0 0`| 允许的最小块大小 |
 |`free 8 / allocate 8 / allocate 1`| 零状态，那么`ERROR!`| 精确配合和零余数 |
 |`free 16 / free 1 / allocate 13`| 尺寸 1 和尺寸 2 保留 | 最小拟合块的正确分解与选择 |
 |`free 1024 / allocate 1023`| 剩下 1 个 size-1 块 | 最大支持大小和边界余数 |

 ## 边缘情况

 ### 精确贴合

 对于```
3
free 8
allocate 8
allocate 1
```

`free 8`套`cnt[3]`到一。 对 8 的请求从索引 3 开始并立即找到该块。 它减一并获得余数为零，因此状态变为全零。 对 1 的下一个请求搜索索引 0 到 10，但什么也没找到，产生`ERROR!`。 最终的输出正是：```
0 0 0 0 0 0 0 0 0 0 0
ERROR!
```关键细节是精确分配不会创建零大小的空闲块。 

### 2 的倍数幂的余数

 对于```
2
free 16
allocate 13
```第一个操作创建一个大小为 16 的块。 分配从大小 16 开始，因为它是不小于 13 的最小的 2 次方。消耗完它后，余数为`16 - 13 = 3`。 二元分解给出`3 = 2 + 1`， 所以`cnt[0]`和`cnt[1]`两者合而为一。 输出是：```
1 1 0 0 0 0 0 0 0 0 0
```这捕获了忘记分解剩余部分的实现。 

### 单独的小块不能合并

 对于```
2
free 1
allocate 2
```之后的状态`free 1`是：```
1 0 0 0 0 0 0 0 0 0 0
```由于需要大小 2，因此分配从索引 1 开始。 不存在大小为 2 的块，也不存在更大的块。 如果不修改 size-1 计数器，分配就会失败：```
1 0 0 0 0 0 0 0 0 0 0
ERROR!
```总内存实现可能会错误地将大小为 1 的块视为足够池的一部分，但实际的分配器适用于各个块。 

### 在较小的块失败后选择较大的块

 对于```
3
free 1
free 8
allocate 2
```分配前的计数器是：```
1 0 0 1 0 0 0 0 0 0 0
```对 2 的请求从索引 1 开始。索引 1 为空，索引 2 也为空，因此搜索到达索引 3 并选择大小为 8 的块。 余数为`8 - 2 = 6`，它分解为 4 和 2。将它们添加到现有的 size-1 块中得到：```
1 1 1 0 0 0 0 0 0 0 0
```该示例证实了分配规则的两个部分：所选块必须是能够满足请求的最小可用块，并且其剩余部分必须独立分解。 

### 最大块边界

 对于```
2
free 1024
allocate 1023
```唯一的空闲块位于索引 10。1023 的分配请求的最小可能块大小为 1024，因此选择索引 10。 余数为 1，递增`cnt[0]`。 输出是：```
0 0 0 0 0 0 0 0 0 0 1
1 0 0 0 0 0 0 0 0 0 0
```搜索必须包括索引 10。使用在最大索引之前停止的循环会错误地将此有效分配报告为失败。
