---
title: "CF 102302K - 糖果"
description: "我们有一个长度为 N 的整数数组 C。糖果序列是该数组的任何非空连续部分，其值是其元素之和。 所需的答案不是有效序列出现的位置数。"
date: "2026-08-13T23:32:32+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102302
codeforces_index: "K"
codeforces_contest_name: "2019 USP-ICMC"
rating: 0
weight: 102302
solve_time_s: 191
verified: true
draft: false
---

[CF 102302K - 糖果](https://codeforces.com/problemset/problem/102302/K)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个整数数组`C`长度`N`。 糖果序列是该数组的任何非空连续部分，其值是其元素的总和。 所需的答案不是有效序列出现的位置数。 等值序列被合并，所以`[4]`出现五次仍然算作一个不同的序列，而`[4]`和`[4, 4]`是不同的，因为它们的长度不同。 

第一行给出`N`，然后是允许的下限和上限`L`和`R`。 第二行包含糖果值。 我们需要其总和位于包含区间内的不同连续数组的数量`[L, R]`。 

和`N`一样大`5 * 10^5`, 枚举所有`N(N+1)/2`间隔已经给出了大约`1.25 * 10^11`最坏情况下的候选人。 二次算法远远超出了 4 秒限制所能支持的范围。 糖果值也可以是负数，因此基于单调滑动窗口的技术不适用。 的界限`L`和`R`抵达`10^18`，而个体值达到`10^9`，因此前缀求和和比较必须在具有固定宽度整数的语言中使用 64 位算术来处理。 

三种情况通常会导致错误的解决方案。 

考虑```
2 2 2
2 2
```有两种情况出现`[2]`，但它们代表相同的不同序列。 正确答案是`1`。 计算有效间隔而不是不同序列的解决方案返回`2`。 

负值打破了通常的两指针参数。 例如，```
3 -1 1
1 -1 1
```有效的不同序列是`[1]`,`[-1]`,`[1,-1]`,`[-1,1]`， 和`[1,-1,1]`, 给予`5`。 假设扩展右端点总是增加总和的滑动窗口无法正确推理该数组。 

边界是包容性的。 为了```
2 2 2
2 3
```仅有的`[2]`有精确的总和`2`，所以答案是`1`。 意外地对任一边界使用严格不等式的解决方案会丢失此序列。 

## 方法

 直接方法考虑每对端点并使用前缀和维护当前和。 对于每个区间，我们可以检查它的总和是否在`[L,R]`并将相应的序列插入到集合中。 这是正确的，因为每个连续序列都有一对端点，并且该集合删除了重复的序列。 问题是间隔的数量：`N = 500000`， 有`N(N+1)/2 = 125000250000`其中。 即使用散列表示每个间隔也会给我们留下粗略的结果`1.25 * 10^11`在考虑维护或比较实际序列的成本之前，这已经是不可能的。 

关键的观察是连续序列是原始数组的某些后缀的前缀。 假设我们修复从位置开始的后缀`i`。 它的前缀有长度`1, 2, ..., N-i`。 如果我们按字典顺序处理后缀，则之前的后缀已经表示的前缀恰好是与前一个后缀的最长公共前缀之前的前缀。 

让`lcp[i]`是与从以下位置开始的后缀相关的 LCP 长度`i`，其中前一个后缀表示按后缀数组顺序紧接在其之前的后缀。 然后后缀`i`准确贡献前缀长度

 [
 lcp[i]+1，\ lcp[i]+2，\ \l点，\ N-i。 
]

 这是计算不同子字符串的常用后缀数组方法，但这里我们不能简单地计算所有这些长度。 我们必须只保留那些金额为`[L,R]`。 

前缀和将该条件转换为范围查询。 定义

 [
 P[0]=0，\qquad P[j]=C_0+C_1+\cdots+C_{j-1}。 
]

 长度前缀`k`的后缀开始于`i`在前缀和位置结束`j=i+k`，其总和为

 [
 P[j]-P[i]。 
]

 因此，前缀在以下情况下有效：

 [
 P[i]+L \le P[j] \le P[i]+R。 
]

 因此，对于每个后缀，我们需要计算端点位置`j`在指数范围内

 [
 i+lcp[i]+1 \le j \le N
 ]

 其前缀和属于值区间`[P[i]+L, P[i]+R]`。 

查询变成二维的：一个坐标是端点位置`j`，另一个是它的前缀和`P[j]`。 我们可以离线处理它们。 对后缀起始位置进行排序`P[i]`。 然后两个查询边界`P[i]+L`和`P[i]+R`单调移动。 在 Fenwick 树中准确维护前缀和当前位于所需值区间内的那些端点位置。 然后，Fenwick 前缀查询会删除在允许的起始端点之前出现的端点。 

后缀数组本身是用标准加倍算法和计数排序构造的，给出`O(N log N)`施工时间。 Kasai 的算法然后在线性时间内计算所有 LCP 值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(N²) 或更差 | 直接集合表示中的 O(N²) | 太慢了|
 | 最佳 | O(N log N) | O(N log N) | O(N) | 已接受 |

 ## 算法演练

 1.构建后缀数组`C`。 后缀数组存储根据从此处开始的后缀的字典顺序排序的所有起始位置。 内部附加了一个小于每个糖果值的唯一哨兵，因此可以使用标准循环移位加倍算法。 
2. 使用 Kasai 算法计算每个后缀的 LCP 值。 对于位置处的后缀`i`,`lcp[i]`是其公共前缀以及按后缀数组顺序紧接在其前面的后缀的长度。 如果没有先前的后缀，则其值为零。 
3. 构建前缀和数组`P`。 对于端点`j`，开始于的子数组的总和`i`并结束于`j-1`是`P[j] - P[i]`。 
4. 对于从以下位置开始的后缀`i`, 设置

 [
 left_i=i+lcp[i]+1。 
]

 仅端点`j >= left_i`表示处理此后缀时新的子字符串。 之前的端点`left_i`对应于已经由较早的后缀表示的前缀。 

1.对所有后缀起始位置进行排序`i`经过`P[i]`，并对所有端点位置独立排序`j`从`1`通过`N`经过`P[j]`。 这给出了可以处理前缀和阈值的通用顺序。 
2、扫增加后缀`P[i]`。 维护包含端点位置的 Fenwick 树`j`满意的

 [
 P[i]+L \le P[j] \le P[i]+R。 
]

 因为后缀是按递增方式处理的`P[i]`，两个边界仅在排序的端点列表中移动到右侧。 当端点进入上限时添加端点，当端点低于下限时删除它们。 

1. 对于当前后缀，令`active`是当前 Fenwick 树中端点的数量。 Fenwick 前缀查询位于`left_i-1`计算太早出现的活动端点，因此

 [
 active-\operatorname{prefixSum}(left_i-1)
 ]

 正是该后缀的新的、不同的前缀的数量，其总和属于`[L,R]`。 

1. 将此贡献添加到每个后缀的答案中。 总和是所需的不同有效连续序列的数量。 

**为什么它有效。** 每个连续序列都是恰好出现一个后缀的前缀，但同一序列可能是多个后缀的前缀。 按照后缀数组顺序，共享前缀的所有后缀形成一个连续的组。 因此，对于后缀，每个长度最多为前一个后缀的 LCP 的前缀都已被表示，而每个较长的前缀都是新的。 价值`left_i`准确地抓住了这种区别。 Fenwick 扫描精确计算那些总和满足两个包含范围的新前缀端点。 由于每个不同的有效序列在一个后缀处都是新的，并且每个计数的前缀都是有效的，因此累积的答案仅包含每个所需序列一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def build_suffix_array(a):
    """Suffix array of an integer array using doubling + counting sort."""
    values = sorted(set(a))
    compress = {x: i + 1 for i, x in enumerate(values)}

    # 0 is a unique sentinel smaller than every real value.
    s = [compress[x] for x in a] + [0]
    m = len(s)

    # Initial counting sort by the first value.
    alphabet = len(values) + 1
    cnt = [0] * alphabet
    for x in s:
        cnt[x] += 1

    pos = [0] * alphabet
    total = 0
    for i in range(alphabet):
        pos[i] = total
        total += cnt[i]

    p = [0] * m
    for i, x in enumerate(s):
        p[pos[x]] = i
        pos[x] += 1

    # Initial equivalence classes.
    c = [0] * m
    classes = 1
    c[p[0]] = 0
    for i in range(1, m):
        if s[p[i]] != s[p[i - 1]]:
            classes += 1
        c[p[i]] = classes - 1

    length = 1

    while length < m:
        # Shift every suffix start left by 'length'.
        pn = [0] * m
        for i, x in enumerate(p):
            y = x - length
            if y < 0:
                y += m
            pn[i] = y

        # Counting sort by the first half's class.
        cnt = [0] * classes
        for x in pn:
            cnt[c[x]] += 1

        pos = [0] * classes
        total = 0
        for i in range(classes):
            pos[i] = total
            total += cnt[i]

        p_new = [0] * m
        for x in pn:
            cl = c[x]
            p_new[pos[cl]] = x
            pos[cl] += 1

        # Recompute classes for pairs of length 2 * length.
        c_new = [0] * m
        new_classes = 1
        c_new[p_new[0]] = 0

        for i in range(1, m):
            cur = p_new[i]
            prev = p_new[i - 1]

            cur_second = cur + length
            if cur_second >= m:
                cur_second -= m

            prev_second = prev + length
            if prev_second >= m:
                prev_second -= m

            if (
                c[cur] != c[prev]
                or c[cur_second] != c[prev_second]
            ):
                new_classes += 1

            c_new[cur] = new_classes - 1

        p = p_new
        c = c_new
        classes = new_classes
        length <<= 1

    # The sentinel suffix is always first.
    return p[1:]

def build_lcp(a, sa):
    """lcp[i] = LCP of suffix i with its previous suffix in SA order."""
    n = len(a)
    rank = [0] * n

    for r, pos in enumerate(sa):
        rank[pos] = r

    lcp = [0] * n
    h = 0

    for i in range(n):
        r = rank[i]

        if r == 0:
            h = 0
            continue

        j = sa[r - 1]

        while i + h < n and j + h < n and a[i + h] == a[j + h]:
            h += 1

        lcp[i] = h

        if h:
            h -= 1

    return lcp

def solve():
    n, L, R = map(int, input().split())
    a = list(map(int, input().split()))

    if n == 0:
        print(0)
        return

    sa = build_suffix_array(a)
    lcp = build_lcp(a, sa)

    # P[j] is the sum of a[0:j].
    pref = [0] * (n + 1)
    s = 0
    for i, x in enumerate(a):
        s += x
        pref[i + 1] = s

    # Query suffixes by P[i].
    query_order = sorted(range(n), key=pref.__getitem__)

    # Endpoint j is represented by prefix sum P[j], j in [1, n].
    endpoint_order = sorted(range(1, n + 1), key=pref.__getitem__)

    # Fenwick tree over endpoint positions.
    bit = [0] * (n + 1)

    def add(idx, delta):
        while idx <= n:
            bit[idx] += delta
            idx += idx & -idx

    def prefix_sum(idx):
        result = 0
        while idx > 0:
            result += bit[idx]
            idx -= idx & -idx
        return result

    hi = 0
    lo = 0
    active = 0
    answer = 0

    for i in query_order:
        low_value = pref[i] + L
        high_value = pref[i] + R

        # Add all endpoints that have entered the upper bound.
        while hi < n and pref[endpoint_order[hi]] <= high_value:
            j = endpoint_order[hi]
            add(j, 1)
            hi += 1
            active += 1

        # Remove endpoints that are below the lower bound.
        while lo < hi and pref[endpoint_order[lo]] < low_value:
            j = endpoint_order[lo]
            add(j, -1)
            lo += 1
            active -= 1

        # Only lengths greater than lcp[i] are new.
        left = i + lcp[i] + 1

        if left <= n:
            too_early = prefix_sum(left - 1)
            answer += active - too_early

    print(answer)

if __name__ == "__main__":
    solve()
```后缀数组结构首先压缩糖果值，以便哨兵可以安全地用零表示，所有实数值用正整数表示。 加倍循环按等价类对对循环移位进行排序。 因为哨兵是唯一且最小的，所以去掉它末尾的后缀就剩下原数组的普通后缀数组。 

LCP 构造使用逆后缀数组来查找每个起始位置的前一个后缀。 Kasai 对先前匹配长度的重用使得字符比较的总数呈线性，即使单个 LCP 值可能很大。 

前缀和`pref[j]`表示紧接在子数组之后的数组端点。 这就是芬威克树使用的端点索引的原因`1`通过`N`，而后缀起始位置是`0`通过`N-1`。 混合这两个坐标系是产生相差一误差的常见原因。 

Fenwick 扫描保持一个值区间而不仅仅是一个上限。 对于从以下位置开始的后缀`i`，一个端点`j`恰好在以下时间有效`pref[j]`介于`pref[i] + L`和`pref[i] + R`。 由于后缀的顺序是`pref[i]`，两个边界都是单调的，因此每个端点最多进入和离开芬威克树一次。 

这`left`表达式包含另一个关键边界。 长度等于的前缀`lcp[i]`已经存在于之前的后缀中，因此第一个新长度是`lcp[i] + 1`。 由于端点是`i + length`，第一个新端点是`i + lcp[i] + 1`。 

Python 整数具有任意精度，因此总和大致为`5 * 10^14`以及最终的答案`1.25 * 10^11`不需要特殊的溢出处理。 在固定宽度语言中，有符号的 64 位整数就足够了。 

## 工作示例

 对于样品 1，```
5 5 10
1 2 3 4 5
```前缀和是`[0, 1, 3, 6, 10, 15]`。 每个后缀都与其他后缀不同，因此所有 LCP 值均为零。 该表显示了直接`[L,R]`扫。 

| 我| LCP[i]| P[i] | 有效 P[j] 范围 | 左| 活跃 | 太早了| 贡献 |
 | --- | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 0 | [5, 10] | 1 | 2 | 0 | 2 |
 | 1 | 0 | 1 | [6, 11] | 2 | 2 | 0 | 2 |
 | 2 | 0 | 3 | [8, 13] | 3 | 1 | 0 | 1 |
 | 3 | 0 | 6 | [11, 16] | 4 | 1 | 0 | 1 |
 | 4 | 0 | 10 | 10 [15, 20] | 5 | 1 | 0 | 1 |

 这五项贡献是`2 + 2 + 1 + 1 + 1 = 7`。 它们对应于`[3,4]`,`[1,2,3,4]`,`[2,3,4]`,`[4,5]`， 和`[5]`以适当的后缀-前缀表示形式。 每个都有之间的总和`5`和`10`。 

对于样品 2，```
5 5 10
1 2 3 4 4
```前缀和是`[0, 1, 3, 6, 10, 14]`。 从位置开始的后缀`3`和`4`是`[4,4]`和`[4]`。 按照后缀数组顺序，`[4]`出现在之前`[4,4]`， 所以`lcp[3] = 1`。 这正是防止发生的原因`[4]`在较长的后缀内，以免被第二次计算。 

| 我| LCP[i]| P[i] | 有效 P[j] 范围 | 左| 活跃 | 太早了| 贡献 |
 | --- | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 0 | [5, 10] | 1 | 2 | 0 | 2 |
 | 1 | 0 | 1 | [6, 11] | 2 | 2 | 0 | 2 |
 | 2 | 0 | 3 | [8, 13] | 3 | 1 | 0 | 1 |
 | 3 | 1 | 6 | [11, 16] | 5 | 1 | 0 | 1 |
 | 4 | 0 | 10 | 10 [15, 20] | 5 | 0 | 0 | 0 |

 捐款总额为`2 + 2 + 1 + 1 = 6`。 重复值`4`说明了为什么事件不能简单地独立计数。 单糖果序列`[4]`已经由从最后一个位置开始的后缀表示，而`[4,4]`是一个真正的新序列。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N log N) | O(N log N) | 后缀数组构造需要 O(N log N)，LCP 构造需要 O(N)，排序前缀和需要 O(N log N)，Fenwick 扫描执行 O(N) 次更新和查询，每次更新和查询的时间复杂度为 O(log N)。 |
 | 空间| O(N) | 后缀数组、LCP 数组、前缀和、排序顺序、等价类和 Fenwick 树均使用线性空间。 |

 为了`N = 5 * 10^5`，二次枚举需要大约`1.25 * 10^11`间隔，而最佳解决方案在线性大小的数组上执行对数数量的传递。 1024 MB 的内存限制远远高于此处使用的线性数组集合。 4 秒限制是为`O(N log N)`解决方案而不是枚举所有子数组的任何方法。 

## 测试用例```python
# This test harness assumes the solution above has been placed in the
# same Python file and that solve() is available.

import sys
import io

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = input

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    input = sys.stdin.readline

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        input = old_input

# Provided samples
assert run("5 5 10\n1 2 3 4 5\n") == "7", "sample 1"
assert run("5 5 10\n1 2 3 4 4\n") == "6", "sample 2"

# Minimum-size input
assert run("1 1 1\n1\n") == "1", "single candy"

# Duplicate occurrences must count only once
assert run("2 2 2\n2 2\n") == "1", "duplicate sequence"

# Negative values, with inclusive lower and upper bounds
assert run("3 -1 1\n1 -1 1\n") == "5", "negative values"

# Maximum-size, all-equal input.
# Every distinct sequence is determined only by its length.
n = 500000
max_input = f"{n} 0 0\n" + " ".join(["0"] * n) + "\n"
assert run(max_input) == str(n), "maximum size"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1 / 1`|`1`| 最小数组大小和单个有效序列 |
 |`2 2 2 / 2 2`|`1`| 重复出现的情况不得计算两次 |
 |`3 -1 1 / 1 -1 1`|`5`| 负值和包含总和边界 |
 |`500000 0 0 / 500000 zeros`|`500000`| 最大尺寸、全部相等的值和性能 |

 ## 边缘情况

 对于重复出现的情况，```
2 2 2
2 2
```后缀是`[2]`和`[2,2]`。 按照后缀数组顺序，`[2]`首先出现并且`[2,2]`LCP 为`1`与它。 第一个后缀贡献`[2]`，而第二个后缀被禁止贡献其长度为一的前缀，只能贡献`[2,2]`。 自从`[2,2]`有总和`4`， 仅有的`[2]`仍然有效，给予`1`。 

对于负值，```
3 -1 1
1 -1 1
```前缀和是`0,1,0,1`。 该算法从不假设前缀和随端点而增加。 相反，它对所有前缀和进行排序并执行值范围查询。 后缀数组部分独立于数字和处理重复，而芬威克树处理前缀和的任意顺序。 五个不同的有效序列是`[1]`,`[-1]`,`[1,-1]`,`[-1,1]`， 和`[1,-1,1]`，所以结果是`5`。 

对于精确边界，```
2 2 2
2 3
```前缀和是`0,2,5`。 对于从第一个位置开始的后缀，所需的前缀和间隔为`[4,4]`，因此不接受任何端点。 对于从第二个位置开始的后缀，间隔为`[4,4]`同样，它的单个端点有前缀和`5`，所以它也在范围之外。 这个例子实际上没有有效的序列，所以输出是`0`。 如果数组是```
2 2 2
2 3
```单一元素`2`有精确的总和`2`并且必须被接受。 终点条件的正确解释是`P[i]+L <= P[j] <= P[i]+R`，也不是严格的不平等。 

对于最大尺寸全相等的情况，```
500000 0 0
0 0 0 ... 0
```每个非空序列的总和为零。 然而，唯一不同的序列是由一个零、两个零、三个零等组成的字符串，直到`500000`零。 后缀数组 LCP 值删除了重复的前缀，为每个可能的长度留下了一个贡献。 答案是`500000`，而算法仍然处理整个输入`O(N log N)`时间。
