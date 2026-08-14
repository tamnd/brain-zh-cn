---
title: "CF 102419G - 大型阵列"
description: "数组 a 没有明确给出。 它是较短数组 b 的无限重复，在 n 个元素后被截断。 如果 b = [b0, b1, ..., b(m-1)]，则 a 的每个 m 个连续元素块都是 b 的另一个副本。"
date: "2026-08-14T14:53:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102419
codeforces_index: "G"
codeforces_contest_name: "SPC 2019"
rating: 0
weight: 102419
solve_time_s: 244
verified: true
draft: false
---

[CF 102419G - 大型阵列](https://codeforces.com/problemset/problem/102419/G)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 数组`a`没有明确给出。 这是较短数组的无限重复`b`，之后截断`n`元素。 如果`b = [b0, b1, ..., b(m-1)]`，那么每个块`m`的连续元素`a`是另一个副本`b`。 

我们需要一个非空的连续段`a`其总和恰好是`k`。 在所有这些线段中，我们想要最短的一个，如果几个线段的长度相同，我们想要左端点最小的一个。 

存档的声明中有一个小小的不一致之处：它说答案满足`1 <= l <= r <= n`，而数组被声明为 0 索引并且官方示例打印`0 3`。 预期输出是基于 0 的包含端点，因此下面的实现遵循示例并打印`l`和`r`和`0 <= l <= r < n`。 

关键约束是`n <= 10^9`，而仅`m <= 10^5`受正常数组处理限制的限制。 建设中`a`明确地可以需要十亿个元素，这对于内存限制来说已经太大了。 在最坏的情况下，即使是 O(n) 扫描也太昂贵了。 总和`m`所有测试用例最多是`3 * 10^5`，因此每个测试用例的 O(m log m) 算法是实用的。 

的价值观`b`可能为负，因此滑动窗口等技术不适用。 前缀和是自然的表示形式，因为段和可以表示为两个前缀和之间的差，而不管元素的符号如何。 前缀总和也可以达到大约`10^14`， 和`k`可以达到`10^18`，所以 32 位算术是不够的。 Python 整数直接处理这些值。 

第一个边缘情况是空段。 例如，```
1
1 3 0
5
```没有总和为零的非空段，所以答案是`-1`。 允许使用相同前缀位置两次的前缀求和实现可能会意外报告零长度段。 

第二种边缘情况是跨越大量重复的答案。 为了```
1
1 1000000000 1000000000
1
```唯一可能的答案是整个数组，`0 999999999`。 任何仅检查一个或几个副本的解决方案`b`找不到它。 

当一个完整的副本`b`总和为零。 为了```
1
2 2 0
1 -1
```答案是`0 1`。 仅限于一个副本内的正确子数组的搜索将错过这个完整周期段。 

第四种边缘情况是负总和。 样本本身包含`b = [1, 1, -3]`，其总数为`-1`，答案是`0 3`。 当周期和为负时，假设完整周期数是通过普通正除法获得的推导可能会选择错误的方向。 

## 方法

 直接方法将构建完整的数组`a`，计算其前缀和，并查找两个前缀位置的差为`k`。 使用哈希映射，这将花费 O(n) 时间和 O(n) 内存，这在以下情况下已经是不可能的：`n`是`10^9`。 枚举每对端点就更糟糕了。 有`n(n+1)/2`非空段，大约是`5 * 10^17`分段时`n = 10^9`。 

蛮力思想仍然有用，因为它揭示了问题的真正结构。 每个段由两个前缀位置决定，我们无法直接检查它们的唯一原因是有太多的重复副本`b`。 

让`S`是一份完整副本的总和`b`。 在一份副本中定义前缀和`p[0] = 0`并且，对于`1 <= i < m`,`p[i] = b[0] + b[1] + ... + b[i-1]`。 

带索引的前缀位置`q * m + r`， 在哪里`0 <= r < m`, 有价值`P(q * m + r) = q * S + p[r]`。 

这就是密钥压缩。 虽然`q`可以大到十亿，每个前缀和的非周期部分是唯一的之一`m`价值观。 

考虑候选右前缀位置`y = q*m+r`。 假设其匹配的左前缀位置是`x = (q-h)*m+s`。 

然后`P[y] - P[x] = h*S + p[r] - p[s]`。 

为了`S != 0`，强制要求所需的完整周期数：`h = (k + p[s] - p[r]) / S`。 

前缀位置之间的距离为`y-x = h*m + r-s`。 

对于固定的右残基`r`，最小化这个表达式意味着找到最小的可能`h`，然后最大可能的`s`。 

可除性条件给出了另一个有用的观察结果。 我们需要`p[s] ≡ p[r] - k (mod |S|)`。 

因此，对于每个余数模`|S|`，我们可以按排序顺序保留属于该残基的所有前缀和。 如果`S > 0`，增加`p[s]`增加`h`，所以我们需要最小的`p[s]`高于对应的阈值`h >= 1`。 如果`S < 0`，方向相反，所以我们需要最大的`p[s]`低于相应的阈值。 

案例`h = 0`很特别。 那么两个前缀位置都在同一个副本中，所以我们必须有`s < r`。 当从左到右扫描残基时，我们可以找到所需前缀值的最近一次出现。 

如果`S = 0`，完整的副本对前缀和没有任何贡献。 目标条件变得简单`p[s] = p[r] - k`。 

在同一个副本中我们再次需要`s < r`。 如果不存在这样的位置，我们可以使用前一个副本中相同的前缀值。 这给出了一段长度`m+r-s`，前提是它的右端点仍在实际数组内。 

暴力破解之所以有效，是因为每个有效段都对应于一对前缀和。 它失败是因为前缀位置太多。 观察到所有前缀位置都具有以下形式`q*S + p[r]`让我们消除巨大的`q`维并求解剩余的`m`带有排序和二分搜索的残留情况。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(1) | O(1) | 太慢了 |
 | 前缀哈希结束`a`| O(n) | O(n) | 太慢了 |
 | 周期性前缀压缩| O(m log m) | O(米) | 已接受 |

 ## 算法演练

 1. 计算总和`S`的一份副本`b`和前缀值`p[0], ..., p[m-1]`。 这些足以代表这个巨大数组的每个前缀位置。 
2.如果`S = 0`，分别处理问题。 对于每个残基`r`，所需的先前前缀值为`p[r] - k`。 搜索之前最新出现的事件`r`获得第一个副本中的一个段。 如果不存在，请在任何地方使用最新出现的位置并将其放置在上一个副本中。 后一个候选在前缀位置结束`m+r`，所以只有当`m+r <= n`。 
3.如果`S != 0`，将每一对分组`(p[s] mod |S|, p[s], s)`通过其余数模`|S|`，然后按残差然后按前缀值对完整集合进行排序。 这让我们能够找到最好的可能`p[s]`对于每个正确的残基，使用二分搜索。 
4. 处理所有可能的正确残留物`r`从`0`通过`m-1`。 首先寻找`p[s] = p[r] - k`职位之间`s < r`。 这是`h = 0`案件。 由于它的长度是`r-s`，最大有效`s`始终是最佳人选`r`。 
5. 对于`h >= 1`，只有前缀值满足`p[s] ≡ p[r] - k (mod |S|)`可以工作。 如果`S > 0`，找到第一个这样的前缀值满足`p[s] >= p[r] - k + S`。 

如果`S < 0`，找到最后一个满足这样的前缀值`p[s] <= p[r] - k + S`。 

这些不平等正是条件`h >= 1`，并选择最接近的可能前缀值给出最小的`h`。 
6.一次`p[s]`被选中，计算`h = (k + p[s] - p[r]) / S`。 

该结构候选的最早出现是通过选择获得的`q = h`。 那么左前缀位置就是`s`，右前缀位置是`h*m+r`。 候选者仅在以下情况下可用`h*m+r <= n`。 
7. 将前缀位置转换回数组端点。 前缀对`(x,y)`表示包含数组段`[x, y-1]`。 首先通过长度比较候选人`y-x`，然后通过它们的左端点`x`。 
8. 如果没有找到候选人，则打印`-1`。 否则打印最佳的基于 0 的包含端点。 

### 为什么它有效

 每个非空子数组唯一对应于两个前缀位置`x < y`，总和`P[y]-P[x] = k`。 为了`S != 0`，将两个位置写为`(q-h)m+s`和`qm+r`给出精确方程`h*S+p[r]-p[s]=k`。 因此，每个有效片段都出现在算法考虑的候选片段中。 

为了`h=0`，条件`s<r`正是条件是两个前缀位置都在同一个副本中。 为了`h>=1`，左前缀自动位于右前缀之前，并且同余加阈值搜索恰好考虑了 的可能值`s`给予积极的`h`。 对于固定的`r`，长度为`h*m+r-s`，所以最小的`h`然后是最大的`s`给出最矮的候选人。 选择`q=h`产生相同的长度和尽可能小的左端点。 这`S=0`分支考虑仅有的两种可能的结构情况，相同副本和先前副本。 因此，每一个可能的最佳片段都会被考虑，最终的比较会准确地选择所需的答案。 

## Python 解决方案```python
import sys
from bisect import bisect_left, bisect_right

input = sys.stdin.readline

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        m, n, k = map(int, input().split())
        b = list(map(int, input().split()))

        p = [0] * m
        cur = 0
        for i in range(m - 1):
            cur += b[i]
            p[i + 1] = cur

        S = sum(b)

        best_len = None
        best_l = None
        best_r = None

        def update(x, y):
            nonlocal best_len, best_l, best_r

            length = y - x
            l = x
            r = y - 1

            if best_len is None or (length, l) < (best_len, best_l):
                best_len = length
                best_l = l
                best_r = r

        if S == 0:
            last_all = {}
            for i, value in enumerate(p):
                last_all[value] = i

            last_before = {}

            for r in range(m):
                target = p[r] - k

                # h = 0, so the left prefix must be before r.
                s = last_before.get(target)
                if s is not None:
                    update(s, r)

                # Use the same prefix value in the previous copy.
                s = last_all.get(target)
                if s is not None:
                    y = m + r
                    if y <= n:
                        update(s, y)

                last_before[p[r]] = r

        else:
            D = abs(S)

            # Each item is (p[s] mod D, p[s], s).
            data = [(p[i] % D, p[i], i) for i in range(m)]
            data.sort()

            # For every residue, store the half-open interval in data.
            bounds = {}
            start = 0
            while start < m:
                key = data[start][0]
                end = start + 1
                while end < m and data[end][0] == key:
                    end += 1
                bounds[key] = (start, end)
                start = end

            last_before = {}

            for r in range(m):
                pr = p[r]
                target = pr - k

                # h = 0.
                s = last_before.get(target)
                if s is not None:
                    update(s, r)

                key = target % D
                interval = bounds.get(key)

                if interval is not None:
                    lo, hi = interval

                    if S > 0:
                        # h >= 1 means:
                        # k + p[s] - p[r] >= S
                        threshold = pr - k + S

                        idx = bisect_left(
                            data,
                            (key, threshold, -1),
                            lo,
                            hi
                        )

                        if idx < hi:
                            pval = data[idx][1]

                            # For the same pval, take the largest s,
                            # because that minimizes h*m + r - s.
                            j = bisect_right(
                                data,
                                (key, pval, m),
                                lo,
                                hi
                            ) - 1

                            s = data[j][2]
                            h = (k + pval - pr) // S
                            y = h * m + r

                            if h >= 1 and y <= n:
                                update(s, y)

                    else:
                        # h >= 1 means:
                        # k + p[s] - p[r] <= S
                        threshold = pr - k + S

                        idx = bisect_right(
                            data,
                            (key, threshold, m),
                            lo,
                            hi
                        ) - 1

                        if idx >= lo:
                            pval = data[idx][1]
                            s = data[idx][2]
                            h = (k + pval - pr) // S
                            y = h * m + r

                            if h >= 1 and y <= n:
                                update(s, y)

                last_before[pr] = r

        if best_len is None:
            out.append("-1")
        else:
            out.append(f"{best_l} {best_r}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```前缀结构仅存储`m`价值观。`p[i]`是位置之前的总和`i`在第一个副本中，因此每个后续副本中的前缀位置都可以通过代数方式重建，而不是被具体化。 

这`S == 0`分支使用两个字典。`last_before`仅包含严格位于当前残基之前的位置，这可以防止意外构造空段。`last_all`当匹配前缀必须来自上一个副本时，提供最新出现的情况。 

为了`S != 0`,`data`排序依据`p[s] mod |S|`第一的。 同一残基类别中的前缀值正是可以参与所需方程的值。 二分搜索实现了由符号施加的方向`S`。 该元组还包含`s`，所以相等的前缀值可以按索引排序，直接选择最新的索引。 

的计算`h`仅在余数条件保证整除后才执行`S`。 Python 的任意精度整数可以安全地处理涉及的大型乘积`n`,`m`，以及前缀和。 

该代码在内部使用前缀位置，因此候选者`(x,y)`成为包含数组间隔`[x,y-1]`。 这也是样本的原因`0 3`是为第一个测试用例生成的。 

## 工作示例

 ### 示例测试 1

 输入是```
3 5 0
1 1 -3
```期间总和为`S = -1`，以及残基的前缀值`0,1,2`是`[0,1,2]`。 

|`r`|`p[r]`| 目标`p[r]-k`|`h=0`候选人 | 积极的`h`候选人 | 最好的|
 | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 0 | 无 | 无 | 无 |
 | 1 | 1 | 1 | 无 |`s=0, h=1, y=4`|`0 3`|
 | 2 | 2 | 2 | 无 |`s=1, h=1, y=5`|`0 3`|

 为了`r=1`，选择`s=0`给出`h=1`。 前缀位置是`x=0`和`y=4`，所以数组段是`[0,3]`，包含`1,1,-3,1`并且总和为零。 候选人为`r=2`长度也为四，但从索引开始`1`，所以打破平局的规则保持不变`0 3`。 

### 示例测试 2

 输入是```
5 5 10
1 1 1 2 2
```这里`S=7`和`p = [0,1,2,3,5]`。 

|`r`|`p[r]`| 目标模数`7`| 积极候选人 | 右前缀`y`| 可以用吗？ |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 4 | 无 | | 没有|
 | 1 | 1 | 5 |`s=4, h=2`| 11 | 11 没有|
 | 2 | 2 | 6 | 无 | | 没有|
 | 3 | 3 | 0 |`s=0, h=1`| 8 | 没有|
 | 4 | 5 | 2 |`s=2, h=1`| 9 | 没有|

 每个代数上有效的候选者都需要一个正确的前缀位置`n=5`。 因此给定数组的子数组之和不能为 10，答案是`-1`。 

这些痕迹说明了原因`n`仅出现在最终可行性检查中。 永远不必生成潜在的大量副本。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m log m) | 构建前缀和是 O(m)，对残差数据进行排序是 O(m log m)，并且每个`m`残基执行 O(log m) 二分搜索。 |
 | 空间| O(米) | 前缀数组、排序数据、残差边界和字典都包含 O(m) 条目。 |

 总计`m`所有测试用例最多是`3 * 10^5`，因此该解决方案仅处理数十万个存储的前缀状态，即使`n`与`10^9`。 内存使用量呈线性关系`m`，时间主要由排序和二分搜索决定，这比线性依赖于 3 秒和 256 MB 的限制要好得多`n`。 

## 测试用例```python
# This harness contains the same algorithm as the submitted solution,
# but exposes solve_io() so that each test can be checked with assertions.

import sys
import io
from bisect import bisect_left, bisect_right

def solve_io(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline
    t = int(input())
    out = []

    for _ in range(t):
        m, n, k = map(int, input().split())
        b = list(map(int, input().split()))

        p = [0] * m
        cur = 0
        for i in range(m - 1):
            cur += b[i]
            p[i + 1] = cur

        S = sum(b)

        best = None

        def update(x, y):
            nonlocal best
            cand = (y - x, x, y - 1)
            if best is None or cand[:2] < best[:2]:
                best = cand

        if S == 0:
            last_all = {}
            for i, value in enumerate(p):
                last_all[value] = i

            last_before = {}

            for r in range(m):
                target = p[r] - k

                s = last_before.get(target)
                if s is not None:
                    update(s, r)

                s = last_all.get(target)
                if s is not None:
                    y = m + r
                    if y <= n:
                        update(s, y)

                last_before[p[r]] = r

        else:
            D = abs(S)
            data = [(p[i] % D, p[i], i) for i in range(m)]
            data.sort()

            bounds = {}
            start = 0
            while start < m:
                key = data[start][0]
                end = start + 1
                while end < m and data[end][0] == key:
                    end += 1
                bounds[key] = (start, end)
                start = end

            last_before = {}

            for r in range(m):
                pr = p[r]
                target = pr - k

                s = last_before.get(target)
                if s is not None:
                    update(s, r)

                key = target % D
                interval = bounds.get(key)

                if interval is not None:
                    lo, hi = interval

                    if S > 0:
                        threshold = pr - k + S
                        idx = bisect_left(
                            data, (key, threshold, -1), lo, hi
                        )

                        if idx < hi:
                            pval = data[idx][1]
                            j = bisect_right(
                                data, (key, pval, m), lo, hi
                            ) - 1
                            s = data[j][2]
                            h = (k + pval - pr) // S
                            y = h * m + r

                            if y <= n:
                                update(s, y)

                    else:
                        threshold = pr - k + S
                        idx = bisect_right(
                            data, (key, threshold, m), lo, hi
                        ) - 1

                        if idx >= lo:
                            pval = data[idx][1]
                            s = data[idx][2]
                            h = (k + pval - pr) // S
                            y = h * m + r

                            if y <= n:
                                update(s, y)

                last_before[pr] = r

        out.append("-1" if best is None else f"{best[1]} {best[2]}")

    sys.stdin = old_stdin
    return "\n".join(out)

# Provided sample
assert solve_io("""\
2
3 5 0
1 1 -3
5 5 10
1 1 1 2 2
""") == """\
0 3
-1
""", "provided sample"

# Minimum-size input
assert solve_io("""\
1
1 1 5
5
""") == "0 0", "single element"

# Maximum n with m = 1
assert solve_io("""\
1
1 1000000000 1000000000
1
""") == "0 999999999", "huge number of repetitions"

# All equal values
assert solve_io("""\
1
4 7 6
2 2 2 2
""") == "0 2", "shortest equal-value segment"

# Zero period sum, plus an impossible large target
assert solve_io("""\
2
2 2 0
1 -1
1 3 10
1
""") == """\
0 1
-1
""", "zero total and impossible target"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 1 5 / 5`|`0 0`| 最小可能数组和单元素答案 |
 |`1 / 1 1000000000 1000000000 / 1`|`0 999999999`| 巨大的`n`和一个跨越十亿个元素的片段|
 |`1 / 4 7 6 / 2 2 2 2`|`0 2`| 全等值和最短长度选择 |
 |`2 / 2 2 0 / 1 -1`和`1 3 10 / 1`|`0 1`,`-1`| 零周期和、全周期边界和不可能的目标 |

 ## 边缘情况

 空段问题的处理方法是保持`last_before`与当前前缀位置分开。 为了```
1
1 3 0
5
```唯一的前缀值是`0`在每个残基处，但在处理第一个也是唯一的残基时没有更早的前缀位置。 自从`S=5`，对于和为零也没有正周期解。 算法打印`-1`而不是将零长度段的前缀与其本身混淆。 

无需构造即可处理巨大的重复情况`a`。 为了```
1
1 1000000000 1000000000
1
```我们有`S=1`和`p[0]=0`。 该方程给出`h=1000000000`。 正确的前缀位置是`h*m+r = 1000000000`，这正是`n`，并且左前缀位置为零。 因此答案是`0 999999999`。 的价值`h`可以很大，但只是整数计算。 

零周期情况使用单独的分支，因为除以`S`将毫无意义。 为了```
1
2 2 0
1 -1
```我们有`S=0`和`p=[0,1]`。 在`r=0`，目标前缀值为零，并且相同的值出现在`s=0`。 没有更早的`s`，因此算法将该事件放置在前一个副本中。 右前缀位置变为`m+r=2`，给出数组段`[0,1]`。 其总和为`1 + (-1) = 0`，所以结果是`0 1`。 

负周期和会改变二分查找的方向。 对于样品的第一次测试，`S=-1`和`p=[0,1,2]`。 在`r=1`，所需的正期候选人有`s=0`, 给予`h = (0 + 0 - 1) / (-1) = 1`。 

正确的前缀位置是`1*3+1=4`，所以该段是`[0,3]`。 其值为`1,1,-3,1`，其总和为零。 该算法通过搜索低于负和阈值的最大前缀值来找到该候选者，而不是使用对正有效的方向`S`。 

通过正确转换前缀端点来处理索引问题。 如果前缀对是`(x,y)`，所选数组元素恰好是索引`x`通过`y-1`。 因此代码打印`x`和`y-1`，它与官方示例的基于 0 的输出约定相匹配，即使语句中显示的数字范围不一致。
