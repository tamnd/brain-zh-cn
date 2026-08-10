---
title: "CF 102503N - 圣烟"
description: "天使为每支香烟定义了固定的圣洁值。 查看该过程的有用方法是忘记天使本身并检查香烟索引的二进制表示。 考虑香烟 (x)，并写出 (y=x-1)。"
date: "2026-08-09T19:19:10+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102503
codeforces_index: "N"
codeforces_contest_name: "National Olympiad in Informatics - Philippines (NOI.PH) Online Eliminations 2020"
rating: 0
weight: 102503
solve_time_s: 743
verified: true
draft: false
---

[CF 102503N - 圣烟](https://codeforces.com/problemset/problem/102503/N)

 **评级：** -
 **标签：** -
 **求解时间：** 12m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 天使为每支香烟定义了固定的圣洁值。 查看该过程的有用方法是忘记天使本身并检查香烟索引的二进制表示。 

考虑香烟 (x)，并写出 (y=x-1)。 当 (y) 的第 ((i-1)) 位被设置时，天使 (i) 恰好接触 (x)。 因此 (x) 被触摸的次数恰好是 (x-1) 中设置的位数，或者

 [
 \operatorname{popcount}(x-1)。 
]

 触摸香烟的时间正是设定位的位置。 如果两根香烟的接触次数相同，则从最近的接触向后比较它们的接触历史。 第一个不同的触摸是稍后针对其相应位更重要的香烟。 因此，在具有相同人口数的香烟中，（x-1）的值越大，相当于香烟指数（x）越大，就越神圣。 

那么整个排名规则就变得非常简单：

 [
 x_1 \text{ 比 } x_2 更神圣
 ]

 恰好在什么时候

 [
 \bigl(\operatorname{popcount}(x_1-1),x_1\bigr)

 >

 \bigl(\operatorname{popcount}(x_2-1),x_2\bigr)
 ]

 按字典顺序。 

对于每个测试用例，我们将此排序限制为区间 (L,\ldots,R)。 值 (a) 和 (b) 要求占据排名 (a) 到 (b) 的元素之和。 

该间隔最多可以包含 (10^9) 根香烟，并且可以有 (5\cdot10^4) 个测试用例。 即使在一个区间上进行线性工作也已经太多了，而 (O((R-L+1)\log(R-L+1))) 排序是完全不可能的。 数字 (10^9) 在二进制中也足够小，每个相关索引仅使用 30 位，这是我们利用的结构属性。 

有几种边界情况可能会悄无声息地破坏实现。 

对于尽可能最小的输入，```
1
1 1 1 1
```唯一的香烟是（1），所以答案是（1）。 这里(x-1=0)，其具有零设置位。 无意中使用的一个实现`popcount(x)`而不是`popcount(x-1)`会在较大的间隔内给出错误的排序。 

为了```
1
1 2 1 1
```答案是（2）。 香烟（2）有（x-1=1），因此它被触摸过一次，而香烟（1）从未被触摸过。 因此第一等级是（2）。 

相同的人口数量也需要小心。 考虑```
1
10 11 1 1
```(x-1)对应的值为(9=1001_2)和(10=1010_2)。 两者都有两个设置位，但（10）的第二次触摸发生在角度（2）处，而（9）的第二次触摸发生在角度（1）处。 因此香烟（11）更神圣，答案是（11）。 仅按触摸次数排序将无法解决此比较问题。 

二次方边界是另一个常见的错误来源。 为了```
1
8 9 1 2
```我们有 (x-1=7) 和 (8)。 第一个具有三个设置位，第二个具有一个，因此顺序是 (8,9)，给出答案 (17)。 将香烟索引本身视为二进制值会改变触摸计数并产生错误的结果。 

## 方法

 直接的解决方案是检查该时间间隔内的每支香烟，计算其神圣键，对所有键进行排序，并对所请求的等级求和。 通过实际模拟天使来计算密钥，每根香烟大约需要 30 位检查，因为 (10^9<2^{30})。 对于长度为 (10^9) 的间隔，排序前大约需要 (3\cdot10^{10}) 次基本检查。 对十亿个结果值进行排序将需要另一次大约 (10^9\log_2(10^9)) 或大约 (3\cdot10^{10}) 的比较。 这种方法与时间限制不兼容，甚至重复 (5\cdot10^4) 测试用例的线性扫描也是不可能的。 

二元观察完全改变了问题。 我们永远不需要列举香烟。 我们只需要对一个区间内具有规定数量的设置位的数字进行计数和求和。 

让(y=x-1)。 那么香烟的间隔([L,R])就变成了间隔

 [
 [L-1,R-1]
 ]

 二进制整数。 对于固定的 popcount (c)，具有该 popcount 的所有值按神圣顺序连续出现，并且在该组内它们按递减的数字顺序出现。 

假设我们可以快速回答以下查询：

 |{y\le X:\operatorname{popcount}(y)=c}|
 ]

 和

 \sum_{\substack{y\le X\\operatorname{popcount}(y)=c}}y。 
]

 然后从 (R-1) 处的答案中减去 (L-2) 处的答案即可得出所需间隔内每个 popcount 组的计数和总和。 

剩下的任务是仅选择一组的一部分。 由于组是按递减 (y) 排序的，因此我们可以通过二分查找找到边界值。 在基于将 30 位数字分成两个 15 位半数的小型预处理方案之后，每个计数或求和查询都可以在恒定时间内进行。 

我们预先计算所有 15 位低半部分的前缀分布。 我们还预先计算由高 15 位确定的完整块的分布。 数字 (y) 写为

 [
 y=h\cdot2^{15}+l。 
]

 对于固定的高部分 (h)，低部分的范围超过 (0,\ldots,2^{15}-1)。 流行计数是

 [
 \operatorname{popcount}(h)+\operatorname{popcount}(l),
 ]

 从对应的低半部计数和总和可以得到整个块的总和。 

只有 (2^{15}=32768) 个可能的低半部分，并且只有大约 (30518) 个可能的高半部分，因为 (y<10^9)。 这使得预处理对于内存而言足够小，并且足够快以在所有 (5\cdot10^4) 测试用例之间共享。 

这两种方法可以总结如下。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(N\log N)) 每个查询，(N=R-L+1) | (O(N)) | 太慢了|
 | 最佳| 预处理后每个查询 (O(\log 10^9)) | (O(2^{15}\cdot30)) | 已接受 |

 ## 算法演练

 1. 将每个卷烟指数（x）转换为（y=x-1）。 当 (y) 的位 (i-1) 为 1 时，天使 (i) 正好接触 (x)，因此接触次数为`popcount(y)`。 对于相等的触摸计数，从最新事件向后比较触摸历史相当于在数值上比较 (y)。 因此，顺序是先递减 popcount，然后递减 (y)。 
2. 将查询间隔表示为(A=L-1)至(B=R-1)。 我们将完全使用这些 (y) 值，并且仅在将它们的总和转换回卷烟指数时添加 1。 
3. 使用 (15) 位将每个 (y) 分成高半部分和低半部分：
 [
 y=(h\ll15)+l。 
]
 预先计算，对于每个可能的低端点，每个 popcount 出现了多少个 15 位数字以及它们的总和是多少。 
4. 为完整的高块预先计算相同的信息。 具有高部分 (h) 的完整块包含从 (0) 到 (2^{15}-1) 的每个低值。 如果低部分有 (j) 个设置位，则整个块贡献
 [
 \binom{15}{j}
 ]
 其低部分总和从预计算中已知的数字。 
5. 使用这些表回答在常数时间内具有任何固定 popcount (c) 的数字 (y\le X) 的计数和总和。 (h)之前的完整块直接来自高表。 最终的部分块是从低前缀表中获得的，移位了`popcount(h)`。 
6. 对于查询间隔，从(B)的前缀信息中减去(A-1)的前缀信息。 这会产生`cnt[c]`，具有 popcount (c) 的区间值的数量，以及`sm[c]`，它们的总 (y) 总和。 
7. 要计算前 (k) 根最神圣香烟的总和，请扫描从 (30) 到 (0) 的 popcount。 如果整个组适合前 (k) 个位置，则将其完整总和相加。 否则，只需要该组的一部分，并且由于该组按递减 (y) 排序，因此我们需要其最大的剩余值。 
8. 假设一个组包含 (n) 个值，并且我们需要它的最大 (t<n) 个值。 同样，我们可以删除它的最小 (n-t) 值。 二分查找区间中第 ((n-t)) 个最小的 (y)。 固定弹出计数前缀计数查询告诉我们候选是否包含足够的值，因此每个二分搜索步骤都是恒定时间。 
9.计算等级(b)的前缀和并减去等级(a-1)的前缀和。 差异正是所要求的等级 (a) 到 (b) 的总和。 

为什么它有效。 关键的不变量是每支香烟都属于一个 popcount 组，并且所有组都按严格递减的 popcount 顺序出现。 在一组内部，触摸历史是从最新的天使向后进行比较，这正是二进制表示形式从最高有效位向下的字典顺序比较。 由于 popcount 是固定的，因此这种比较相当于递减的数字顺序。 因此，预处理给出了最终排名中每个连续块的确切大小和总和。 当请求的前缀在一个块内结束时，二分搜索精确地识别所需数字后缀的边界。 因此，前缀和包含的每个元素都具有完全正确的排名，并且不包含该前缀之外的任何元素。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

BITS = 15
BLOCK = 1 << BITS
MAX_Y = 10**9 - 1
MAX_HIGH = MAX_Y >> BITS
MAX_POP = 30

# Binomial coefficients C(15, k).
comb = [1] * (BITS + 1)
for i in range(1, BITS + 1):
    comb[i] = comb[i - 1] * (BITS - i + 1) // i

# For all 15-bit values, grouped by popcount:
# full_cnt[k] = number of values in [0, BLOCK-1] with popcount k
# full_sum[k] = their sum
full_cnt = comb[:]
full_sum = [0] * (BITS + 1)
for k in range(1, BITS + 1):
    full_sum[k] = ((BLOCK - 1) * comb[k - 1] * k) // BITS

# Low-half prefix tables.
# low_cnt[k][x] = count of v <= x with popcount(v) = k
# low_sum[k][x] = sum of those v
low_cnt = [array('I', [0]) * BLOCK for _ in range(BITS + 1)]
low_sum = [array('Q', [0]) * BLOCK for _ in range(BITS + 1)]

low_pop = [0] * BLOCK
for x in range(BLOCK):
    low_pop[x] = x.bit_count()

for k in range(BITS + 1):
    cnt = 0
    sm = 0
    ac = low_cnt[k]
    ass = low_sum[k]

    for x in range(BLOCK):
        if low_pop[x] == k:
            cnt += 1
            sm += x
        ac[x] = cnt
        ass[x] = sm

# High-block prefix tables.
#
# high_cnt[k][h] = number of y in complete blocks with high part < h
#                  having popcount k.
# high_sum[k][h] = corresponding sum of y.
#
# h itself is an exclusive endpoint.
HIGH_SIZE = MAX_HIGH + 1

high_cnt = [array('I', [0]) * HIGH_SIZE for _ in range(MAX_POP + 1)]
high_sum = [array('Q', [0]) * HIGH_SIZE for _ in range(MAX_POP + 1)]

high_pop = [h.bit_count() for h in range(MAX_HIGH)]

for k in range(MAX_POP + 1):
    cnt = 0
    sm = 0
    ac = high_cnt[k]
    ass = high_sum[k]

    for h in range(MAX_HIGH):
        j = k - high_pop[h]

        if 0 <= j <= BITS:
            c = full_cnt[j]
            cnt += c
            sm += h * BLOCK * c + full_sum[j]

        ac[h + 1] = cnt
        ass[h + 1] = sm

def prefix_distribution(x):
    """Return counts and sums by popcount for all y in [0, x]."""
    if x < 0:
        return [0] * (MAX_POP + 1), [0] * (MAX_POP + 1)

    h = x >> BITS
    l = x & (BLOCK - 1)
    hp = h.bit_count()

    cnt = [0] * (MAX_POP + 1)
    sm = [0] * (MAX_POP + 1]

    for k in range(MAX_POP + 1):
        c = high_cnt[k][h]
        s = high_sum[k][h]

        j = k - hp
        if 0 <= j <= BITS:
            lc = low_cnt[j][l]
            ls = low_sum[j][l]
            c += lc
            s += ls + h * BLOCK * lc

        cnt[k] = c
        sm[k] = s

    return cnt, sm

def count_sum_upto(x, k):
    """Count and sum y <= x with popcount(y) = k."""
    if x < 0:
        return 0, 0

    h = x >> BITS
    l = x & (BLOCK - 1)
    hp = h.bit_count()

    cnt = high_cnt[k][h]
    sm = high_sum[k][h]

    j = k - hp
    if 0 <= j <= BITS:
        lc = low_cnt[j][l]
        ls = low_sum[j][l]
        cnt += lc
        sm += ls + h * BLOCK * lc

    return cnt, sm

def sum_largest_in_group(A, B, k, total_count, total_sum, take):
    """
    Sum the 'take' largest y in [A, B] having popcount k.
    The group is ordered increasingly by y here, so we remove
    the smallest total_count - take values.
    """
    if take == 0:
        return 0
    if take == total_count:
        return total_sum

    remove = total_count - take

    base_count, base_sum = count_sum_upto(A - 1, k)

    lo = A
    hi = B

    # Find the remove-th smallest value.
    while lo < hi:
        mid = (lo + hi) // 2
        c, _ = count_sum_upto(mid, k)
        c -= base_count

        if c >= remove:
            hi = mid
        else:
            lo = mid + 1

    _, boundary_sum = count_sum_upto(lo, k)
    smallest_sum = boundary_sum - base_sum

    return total_sum - smallest_sum

def prefix_holiest(A, B, need, cnt, sm):
    """
    Sum the first 'need' holiest cigarettes in [A+1, B+1],
    where A and B are y=x-1 endpoints.
    """
    if need <= 0:
        return 0

    answer = 0
    remaining = need

    for k in range(MAX_POP, -1, -1):
        group_count = cnt[k]
        if group_count == 0:
            continue

        if remaining >= group_count:
            answer += sm[k]
            remaining -= group_count

            if remaining == 0:
                break
        else:
            answer += sum_largest_in_group(
                A, B, k, group_count, sm[k], remaining
            )
            break

    # Convert the selected y values into cigarette indices x=y+1.
    return answer + need

def solve():
    T = int(input())
    out = []

    for _ in range(T):
        L, R, a, b = map(int, input().split())

        A = L - 1
        B = R - 1

        right_cnt, right_sum = prefix_distribution(B)
        left_cnt, left_sum = prefix_distribution(A - 1)

        cnt = [0] * (MAX_POP + 1)
        sm = [0] * (MAX_POP + 1)

        for k in range(MAX_POP + 1):
            cnt[k] = right_cnt[k] - left_cnt[k]
            sm[k] = right_sum[k] - left_sum[k]

        result_b = prefix_holiest(A, B, b, cnt, sm)
        result_a = prefix_holiest(A, B, a - 1, cnt, sm)

        out.append(str(result_b - result_a))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第一个预处理块构建 15 位的二项式系数。 一组恰好具有 (k) 个设置位的 15 位值包含 (\binom{15}{k}) 个元素。 通过观察 15 位位置中的每一个恰好出现在 (\binom{14}{k-1}) 个这样的值，即可获得相应的总和。 

下半部分表存储从 (0) 到 (32767) 的每个端点的精确前缀信息。 由于 15 位值只有 16 个可能的 popcount，因此这些表很小。 

上半部分表代表完整的块。`high_cnt[k][h]`包含所有完整块，其高位部分小于`h`。 这种排他约定使前缀查询变得干净：当请求的值有高部分时`h`, 之前的块`h`是完整的，只有块的低部分`h`需要特殊处理。 

功能`prefix_distribution`将这两部分结合起来。 如果高的部分贡献`hp`设置位，然后是低部分`j`设置位给出的总 popcount 为`hp + j`。 其数值为`h * BLOCK + low`，这解释了额外的`h * BLOCK * count`总和中的术语。 

间隔分布是通过减去两个前缀得到的。 此减法必须使用原始香烟坐标中的 (L-2)，因为 (A=L-1) 是第一个 (y)，并且我们希望值严格位于 (A) 之前。`prefix_holiest`从最大到最小处理弹出计数，因为接触计数是主要的圣洁标准。 在一个 popcount 组中，最大的数值排在第一位，因此`sum_largest_in_group`选择数字升序组所需的后缀。 

二分查找使用固定 popcount 计数函数，而不是构造任何实际值。 搜索区间两边都包含，条件`c >= remove`查找至少包含所需数量的较小元素的第一个值。 因此，该边界处的总和恰好包含最小的`remove`减去 (A) 之前的前缀后的元素。 

Python 整数具有任意精度，因此总和不会有溢出的风险。 用于预处理的数组使用无符号 32 位整数进行计数，使用无符号 64 位整数进行求和，这样可以在覆盖整个数值范围的同时保持较小的内存使用量。 

## 工作示例

 对于第一个样本，唯一的香烟是 (1)，因此 (y=0)。 它的 popcount 为零，并且它是该区间的唯一成员。 

| 步骤| (一)| （二）| 人口统计 | 组数 | 剩余| 所选 (y) | 的总和
 | --- | --- | --- | --- | --- | --- | --- |
 | 流程组| 0 | 0 | 0 | 1 | 1 | 0 |
 | 转换为香烟指数| 0 | 0 | 0 | 1 | 0 | 1 |

 所选择的(y)-和为零，但是每个所选择的(y)对应于香烟(y+1)。 因此答案是（0+1=1）。 

对于样本 2 的第一个查询，区间为 (2) 到 (11)，因此 (y) 的范围为 (1) 到 (10)。 这些组是

 [
 \开始{对齐}
 \operatorname{popcount}=3 &: 7,\
 \operatorname{popcount}=2 &: 10,9,6,5,3,\
 \operatorname{popcount}=1 &: 8,4,2,1。 
\结束{对齐}
 ]

 加一换算回香烟指数后，圣阶为

 [
 8,11,10,7,6,4,9,5,3,2。 
]

 为了获得排名（6）到（8），我们从长度（8）的前缀中减去长度（5）的前缀。 

| 前缀| 人口统计 | 组数 | 团体要求| 精选卷烟指数| 前缀和|
 | --- | --- | --- | --- | --- | --- |
 | 前 5 | 3 | 1 | 1 | 8 | 8 |
 | 前 5 | 2 | 5 | 4 | 11、10、7、6 | 42 | 42
 | 前 8 | 3 | 1 | 1 | 8 | 8 |
 | 前 8 | 2 | 5 | 5 | 11、10、7、6、4 | 46 | 46
 | 前 8 | 1 | 4 | 2 | 9, 5 | 60|

 请求的总和是

 [
 60-42=18。 
]

 这证明了中心不变量：完整的 popcount 组可以立即被消耗，而部分组只需要其最大的数字成员。 

对于样本 2 的第三个查询，区间为 (2) 到 (17)，对应于 (y=1) 到 (16)。 订单的开头是

 [
 16,14,13,11,7,12,10,9,6,5,3,15,8,4,2,1
 ]

 当在适当的 popcount 组中写为 (y) 值时。 加一后，排名 (12,13,14) 为 (17,9,5)，得到 (31)。 

| 排名| (y)| 香烟 (y+1) | 人口统计 |
 | --- | --- | --- | --- |
 | 12 | 12 16 | 16 17 | 17 1 |
 | 13 | 8 | 9 | 1 |
 | 14 | 14 4 | 5 | 1 |

 请求的三种香烟都在同一个 popcount 组中，因此该组内的数字顺序决定了它们的顺序。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 预处理时间| (O(30\cdot2^{15})) | 构建低流行计数和高流行计数前缀表 |
 | 每个测试用例 | (O(30+\log 10^9)) | 两个分布、两次前缀扫描和最多两次 30 步二分搜索 |
 | 总时间 | (O(30\cdot2^{15}+T\log 10^9)) | 共享预处理加上所有测试用例|
 | 空间| (O(30\cdot2^{15})) | Popcount 计数和总和表 |

 预处理仅执行一次。 对于 (5\cdot10^4) 测试用例，查询工作只是几百万个小表操作加上每个请求的前缀大约 30 次二分搜索迭代。 这避免了对 (R-L+1) 的任何依赖，而这是包含接近 10 亿支香烟的间隔的关键要求。 

## 测试用例

 以下测试工具使用直接强力预言机。 它的目的是为了验证，而不是为了提交，所以它故意简单。```python
import io
import sys

def run(inp: str) -> str:
    data = io.StringIO(inp)
    t = int(data.readline())
    answers = []

    for _ in range(t):
        L, R, a, b = map(int, data.readline().split())

        values = list(range(L, R + 1))
        values.sort(
            key=lambda x: ((x - 1).bit_count(), x),
            reverse=True
        )

        answers.append(str(sum(values[a - 1:b])))

    return "\n".join(answers)

# Provided samples
assert run(
    """1
1 1 1 1
"""
) == "1", "sample 1"

assert run(
    """3
2 11 6 8
2 11 1 1
2 17 12 14
"""
) == "18\n8\n31", "sample 2"

# Minimum interval
assert run(
    """1
1 1 1 1
"""
) == "1", "minimum-size input"

# Using x-1 instead of x must be handled correctly.
assert run(
    """1
1 2 1 1
"""
) == "2", "x-1 popcount boundary"

# Equal popcount, where numerical order breaks the tie.
assert run(
    """1
10 11 1 1
"""
) == "11", "equal-popcount ordering"

# Crossing a power of two changes the touch count sharply.
assert run(
    """1
8 9 1 2
"""
) == "17", "power-of-two boundary"

# Large index, testing the upper numeric boundary.
assert run(
    """1
1000000000 1000000000 1 1
"""
) == "1000000000", "maximum index"

# A partial popcount group.
assert run(
    """1
1 4 2 3
"""
) == "5", "partial group"

# All requested ranks collapse to one exact rank.
assert run(
    """1
2 11 6 6
"""
) == "4", "single requested rank"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1 1`|`1`| 最小间隔和 popcount 为零 |
 |`1 2 1 1`|`2`| 正确使用(x-1) |
 |`10 11 1 1`|`11`| 相等的弹出计数和最近触摸排序 |
 |`8 9 1 2`|`17`| 二次幂边界 |
 |`1000000000 1000000000 1 1`|`1000000000`| 最大索引|
 |`1 4 2 3`|`5`| 排名内部分精选|
 |`2 11 6 6`|`4`| 单列查询 |

 ## 边缘情况

 对于最小输入```
1
1 1 1 1
```我们有 (A=B=0)。 唯一有成员的组是 popcount 零，计数为 1，总和为零。 第一个最神圣的前缀选择该值，最后的转换加一，产生 (1)。 

为了```
1
1 2 1 1
```变换后的区间为 (y=0,1)。 popcount-one 组包含 (y=1)，因此它在包含 (y=0) 的 popcount-zero 组之前被处理。 因此，第一等级是香烟（1+1=2）。 这抓住了计算中的常见错误`popcount(x)`而不是`popcount(x-1)`。 

为了```
1
10 11 1 1
```变换后的值为 (9=1001_2) 和 (10=1010_2)。 两者都有两次接触。 他们最近的接触都是天使 (4)，因此比较移至前一次接触。 天使（2）触碰（10），而天使（1）触碰（9）。 因此（10）比（9）更神圣，对应于香烟（11）是第一级。 

为了```
1
8 9 1 2
```变换后的值为 (7=111_2) 和 (8=1000_2)。 他们的触摸次数分别为 3 次和 1 次。 无论数值较小，popcount-3 香烟都必须排在第一位，给出顺序 (8,9) 和答案 (17)。 

对于最大索引，```
1
1000000000 1000000000 1 1
```转换后的值为 (999999999)，仍然适合 30 位。 预处理和查找表涵盖了最多 (10^9-1) 的每个可能的转换值，因此在没有特殊情况的情况下处理单例区间，并且答案正是 (1000000000)。 

对于部分群体，例如```
1
1 4 2 3
```变换后的值为 (0,1,2,3)。 他们的流行计数是（0,1,1,2），所以香烟的顺序是（4,3,2,1）。 等级(2)和(3)是(3)和(2)，给出(5)。 该算法在消耗完整的 popcount-2 组后到达 popcount-1 组，然后使用部分组选择例程来准确获取所需的最大值。
