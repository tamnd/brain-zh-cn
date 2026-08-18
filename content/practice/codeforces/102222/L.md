---
title: "CF 102222L - 连续间隔"
description: "对于子数组 (al,ldots,ar)，对其值进行排序并按排序顺序查看连续值。 当两个相邻不同值之间的间隙不超过 (1) 时，子数组准确有效。 允许值相等，因此 ([1,1,2,2]) 等子数组是有效的。"
date: "2026-08-17T22:18:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102222
codeforces_index: "L"
codeforces_contest_name: "2018-2019 ACM-ICPC, China Multi-Provincial Collegiate Programming Contest"
rating: 0
weight: 102222
solve_time_s: 143
verified: true
draft: false
---

[CF 102222L - 连续间隔](https://codeforces.com/problemset/problem/102222/L)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于子数组 (a_l,\ldots,a_r)，对其值进行排序并按排序顺序查看连续值。 当两个相邻不同值之间的间隙不超过 (1) 时，子数组准确有效。 允许值相等，因此 ([1,1,2,2]) 等子数组是有效的。 

表达条件的一种有用方法是忽略相同值的重复副本。 令 (mx) 为最大值，(mn) 为最小值，(cnt) 为子数组中不同值的数量。 因为每个值都是 (mn) 和 (mx) 之间的整数，所以该范围内有 (mx-mn+1) 个可能的整数值。 当这些值中的每一个出现时，子数组都是连续的，这给出了

 [
 mx-mn+1=cnt。 
]

 等价地，

 [
 mx-mn-cnt=-1。 
]

 因此问题就变成了计算数量 (mx-mn-cnt) 等于 (-1) 的子数组。 这是标准解决方案使用的中心转换。 

一个测试用例中最多有 (10^5) 个元素，总共 (10^6) 个元素。 (O(n^2)) 解决方案大约执行 (n(n+1)/2) 次区间扩展，当 (n=10^5) 时，这大约是 (5\cdot10^9) 次操作。 即使采用恒定时间更新，这也远远超出了 10 秒比赛限制所能容忍的范围。 我们需要一种 (O(n\log n)) 方法，每个元素仅进行线性或对数工作。 

第一个边缘情况是重复。 用于输入```
1
2
1 1
```正确答案是 (3)，因为所有三个子数组都是连续的。 粗心的解决方案可能会将子数组长度与 (mx-mn+1) 进行比较，将 ([1,1]) 视为在仅包含一个整数的范围内有两个元素。 重复不会产生间隙，因此正确的数量是不同值的数量，而不是长度。 

第二个边缘情况是缺少整数。 为了```
1
2
1 3
```答案是（2）。 单例间隔有效，但 ([1,3]) 无效，因为排序值的间隙为 (2)。 仅仅检查最小值和最大值是否接近某个范围的端点是不够的。 不同计数相等可以正确检测缺失值。 

第三种边缘情况是包含重复值和所有必需值的区间。 为了```
1
4
1 2 2 3
```十个子数组中的每一个都是连续的，所以答案是（10）。 完整区间有 (mx=3)、(mn=1) 和 (cnt=3)，得出 (3-1+1=3)。 重复的 (2) 不会改变 (cnt)。 

最终的实现边缘情况来自于答案可能很大这一事实。 当所有（10^5）个元素都相等时，每个子数组都有效，答案为

 [
 \frac{10^5\cdot100001}{2}=5,000,050,000。 
]

 32 位有符号整数是不够的。 Python 整数会自动处理此问题，但 C++ 中的相同算法需要 64 位答案。 

## 方法

 直接方法固定左端点并扩展右端点。 在扩展的同时，我们可以维护当前的最小值、最大值和一组不同的值。 然后，每个扩展对集合进行预期的 (O(1)) 功，并对极值进行常数功。 这给出了 (O(n^2)) 总时间，并且它是正确的，因为每个子数组都被检查一次。 

问题是子数组的数量。 它们有 (n(n+1)/2) 个，对于 (n=10^5) 来说大约是 (5\cdot10^9) 。 尽管每个单独的扩展都很便宜，但总的工作却并不便宜。 

更快的方法修复右端点 (r) 并同时考虑每个可能的左端点。 定义

 [
 F_r(l)=\max(a_l,\ldots,a_r)-\min(a_l,\ldots,a_r)-\operatorname{distinct}(a_l,\ldots,a_r)。 
]

 我们需要 (F_r(l)=-1) 的左端点数量。 

当附加 (a_r) 时，仅左端点的连续集合的最大变化。 单调递减堆栈准确地告诉我们哪些左端点的最大值被 (a_r) 替换。 类似地，单调递增堆栈告诉我们哪些左端点的最小值被 (a_r) 替换。 

不同计数部分有一个特别干净的更新。 假设 (a_r) 上一次出现的位置是 (p)。 对于以 (r) 结尾的子数组，当其左端点位于 ([p+1,r]) 中时，新值 (a_r) 就是一个新的不同值。 因此，我们在该范围内从 (F_r(l)) 中减去 (1)。 

所有三个操作都是对由左端点索引的数组进行范围添加。 我们需要维护该数组的最小值以及有多少位置达到该最小值。 惰性线段树正好支持这种操作。 

还有一个有用的不等式：

 [
 \operatorname{distinct}\leq\max-\min+1。 
]

 因此

 [
 F_r(l)=\max-\min-\operatorname{distinct}\geq -1。 
]

 单例区间 ([r,r]) 始终具有 (F_r(r)=-1)。 因此，在处理位置 (r) 后，线段树的全局最小值始终恰好为 (-1)，并且达到该最小值的位置数正是以 (r) 结尾的有效子数组的数量。 我们甚至不需要对 ([1,r]) 进行单独的查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^2)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(n\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

1. 创建一棵线段树，其叶子 (l) 表示当前右端点的值 (F(l))。 最初每个值都是 (0)，因为尚未处理任何右端点。 每个树节点存储其范围内的最小值、达到该最小值的叶子数量以及惰性加法。 
2. 维护最大值的单调递减堆栈。 每个堆栈条目都存储一个值及其最近的位置。 在插入(a_r)之前，前一个栈顶之后的左端点都获得(a_r)作为它们的新最大值，因此将(a_r)添加到该范围。 
3. 删除值小于或等于(a_r) 的堆栈条目。 当删除条目 ((v,p)) 时，前一个幸存堆栈位置和 (p) 之间的左端点范围的最大贡献从 (v) 更改为 (a_r)。 将 (a_r-v) 添加到该范围。 相同的值也会被弹出，因为最新出现的值为将来的更新提供了正确的边界。 
4. 将 ((a_r,r)) 压入最大堆栈。 每个数组位置最多进入和离开该堆栈一次，因此所有最大更新总共只需要 (O(n)) 范围更新操作。 
5. 使用单调递增堆栈重复相同的构造以获得最小值。 最小值在 (F) 中的贡献带有负号，因此当 (a_r) 成为新的最小值时，直接贡献为 (-a_r)。 当旧的最小值 (v) 被 (a_r) 替换时，添加 (v-a_r)。 
6. 使用字典查找 (a_r) 的上一次出现 (p)。 将 (-1) 添加到范围 ([p+1,r])。 这些正是 (a_r) 尚未出现在前面的子数组中的左端点。 然后将 (r) 存储为新的先前出现的位置。 
7.读取线段树的根。 其最小值为 (-1)，其计数是以 (r) 结尾的有效间隔的数量。 将计数添加到答案中。 
8. 处理完所有正确的端点后，在所需的位置打印累积的答案`Case #x: y`格式。 

### 为什么它有效

 对于每个固定的右端点 (r)，线段树的叶子 (l) 准确地表示

 [
 F_r(l)=\max(a_l,\ldots,a_r)-\min(a_l,\ldots,a_r)-\operatorname{distinct}(a_l,\ldots,a_r)。 
]

 最大堆栈更新保留每个左端点的最大项，因为堆栈根据当前出现的最大值对左端点进行分区。 最小堆栈对最小项执行相同的操作。 先前出现的更新对每个子数组中的每个不同值精确地减去一次，因为某个值在其先前出现后会影响左端点的不同计数。 

因此，在处理位置 (r) 后，每个叶子都有正确的 (F_r(l))。 当 (F_r(l)=-1) 时，子数组是连续的。 由于每个 (F_r(l)\geq-1) 和单例区间都相等，因此线段树最小值为 (-1)，并且其最小计数正是以 (r) 结尾的连续区间的数量。 将此计数与所有 (r) 相加，对每个有效子数组恰好计数一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1_000_000)

class SegmentTree:
    def __init__(self, n):
        self.n = n
        size = 4 * n + 5
        self.mn = [0] * size
        self.cnt = [0] * size
        self.lazy = [0] * size
        self._build(1, 1, n)

    def _build(self, p, l, r):
        self.cnt[p] = r - l + 1
        if l == r:
            return
        m = (l + r) >> 1
        self._build(p << 1, l, m)
        self._build(p << 1 | 1, m + 1, r)

    def _push(self, p):
        z = self.lazy[p]
        if z:
            lc = p << 1
            rc = lc | 1

            self.mn[lc] += z
            self.mn[rc] += z
            self.lazy[lc] += z
            self.lazy[rc] += z

            self.lazy[p] = 0

    def _pull(self, p):
        lc = p << 1
        rc = lc | 1

        if self.mn[lc] < self.mn[rc]:
            self.mn[p] = self.mn[lc]
            self.cnt[p] = self.cnt[lc]
        elif self.mn[lc] > self.mn[rc]:
            self.mn[p] = self.mn[rc]
            self.cnt[p] = self.cnt[rc]
        else:
            self.mn[p] = self.mn[lc]
            self.cnt[p] = self.cnt[lc] + self.cnt[rc]

    def _add(self, p, l, r, ql, qr, value):
        if ql <= l and r <= qr:
            self.mn[p] += value
            self.lazy[p] += value
            return

        self._push(p)

        m = (l + r) >> 1
        if ql <= m:
            self._add(p << 1, l, m, ql, qr, value)
        if qr > m:
            self._add(p << 1 | 1, m + 1, r, ql, qr, value)

        self._pull(p)

    def add(self, l, r, value):
        if l <= r:
            self._add(1, 1, self.n, l, r, value)

    @property
    def minimum(self):
        return self.mn[1]

    @property
    def minimum_count(self):
        return self.cnt[1]

def count_intervals(a):
    n = len(a)
    seg = SegmentTree(n)

    big = []
    small = []
    last = {}

    answer = 0

    for r, x in enumerate(a, 1):
        # Add the contribution of the new maximum.
        left = big[-1][1] + 1 if big else 1
        seg.add(left, r, x)

        # Replace old maxima by x.
        while big and big[-1][0] <= x:
            value, pos = big.pop()
            left = big[-1][1] + 1 if big else 1
            seg.add(left, pos, x - value)

        big.append((x, r))

        # Add the contribution of the new minimum.
        left = small[-1][1] + 1 if small else 1
        seg.add(left, r, -x)

        # Replace old minima by x.
        while small and small[-1][0] >= x:
            value, pos = small.pop()
            left = small[-1][1] + 1 if small else 1
            seg.add(left, pos, value - x)

        small.append((x, r))

        # Count x as a distinct value exactly for left endpoints
        # after its previous occurrence.
        previous = last.get(x, 0)
        seg.add(previous + 1, r, -1)
        last[x] = r

        # The minimum is always -1 because [r, r] is valid.
        answer += seg.minimum_count

    return answer

def solve():
    t = int(input())
    out = []

    for case_id in range(1, t + 1):
        n = int(input())
        a = list(map(int, input().split()))

        out.append(
            f"Case #{case_id}: {count_intervals(a)}"
        )

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```线段树被初始化为所有值都为零。 这`cnt`数组记录了每个节点有多少个叶子，因此初始最小值为零，并且每个位置都对其计数有贡献。 

这`_add`方法执行标准的惰性范围加法。 完全覆盖的节点直接接收值，而部分覆盖的节点将其待处理的惰性值推送到其子节点，递归，然后重新计算其最小和最小计数。 

最大堆栈存储对`(value, position)`按值递减顺序。 第一个范围添加将新值分配给当前堆栈顶部之后的左端点。 每个弹出的条目代表一个范围，其旧最大值被新值替换，因此其贡献变化为`x - value`。 

最小堆栈是对称的，但其贡献具有相反的符号。 其置换量为`value - x`。 

字典`last`由实际数组值作为键控，因此最大 (10^9) 的值不需要坐标压缩。 如果`previous`是最后一次出现`x`，那么正好是左端点`previous + 1`通过`r`看`x`首次。 

答案已更新使用`seg.minimum_count`在当前右端点的所有三种类型的更改之后。 单例 ([r,r]) 始终使最小值等于 (-1)，因此不需要查询范围或对不活动叶子进行特殊处理。 

Python 整数还消除了最终答案的任何溢出问题。 递归线段树深度仅为 (O(\log n))，而`sys.setrecursionlimit`为递归实现提供了足够的空间。 

## 工作示例

 对于第一个样本，数组为 ([1,2,1,2])。 每个子数组都是连续的，因为唯一可以出现的值是 (1) 和 (2)，它们是连续的。 

| 右端点 (r) | (a_r) | 有效左端点 | 最低 | 最小数量| 运行答案|
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 1 | -1 | 1 | 1 |
 | 2 | 2 | 1, 2 | -1 | 2 | 3 |
 | 3 | 1 | 1、2、3 | -1 | 3 | 6 |
 | 4 | 2 | 1、2、3、4 | -1 | 4 | 10 | 10

 这里重要的一点是重复项不会增加不同计数。 例如，在 (r=3) 处，区间 ([1,2,1]) 具有最大值 (2)、最小值 (1) 和两个不同的值，因此 (2-1-2=-1)。 结束于位置 (3) 的三个间隔均被计算在内。 

对于第二个样本，数组为 ([1,3,2,4])。 

| 右端点 (r) | (a_r) | 有效左端点 | 最低 | 最小数量| 运行答案|
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 1 | -1 | 1 | 1 |
 | 2 | 3 | 2 | -1 | 1 | 2 |
 | 3 | 2 | 1、2、3 | -1 | 3 | 5 |
 | 4 | 4 | 2, 3, 4 | -1 | 3 | 8 |

 在 (r=2) 处，区间 ([1,3]) 被拒绝，因为其最大值为 (3)，最小值为 (1)，并且包含两个不同的值。 它的值为(3-1-2=0)，而不是(-1)。 在(r=3)处，添加(2)填充([1,3])中缺失的整数，因此([1,3,2])变得有效。 在 (r=4) 处，([3,2,4]) 有效，因为其排序值是 (2,3,4)，而 ([2,4]) 仍然无效，因为缺少 (3)。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n\log n)) | 每个元素进入和离开每个单调堆栈一次，产生 (O(n)) 范围添加，并且每个范围添加成本 (O(\log n))。 |
 | 空间| (O(n)) | (O(n)) | 线段树、两个单调堆栈和最后出现的字典都使用 (O(n)) 内存。 |

 在所有测试用例中，总数 (n) 最多为 (10^6)。 该算法对每个元素执行线性数量的堆栈操作和范围更新，具有对数线段树成本，给出 (O(10^6\log 10^5)) 渐近工作。 最大测试用例中的内存消耗是线性的，符合预期实现的 256 MB 限制。 

## 测试用例

 以下测试旨在附加在上述解决方案代码之后。 帮助器重定向标准输入和输出并重置`input`函数，因此每次调用的行为就像一次单独的比赛运行。```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()

        global input
        input = sys.stdin.readline

        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        input = sys.stdin.readline

# Provided samples
sample = """\
2
4
1 2 1 2
4
1 3 2 4
"""
assert run(sample) == "Case #1: 10\nCase #2: 8", "provided samples"

# Minimum-size input
assert run("""\
1
1
7
""") == "Case #1: 1", "single element"

# All values equal: every subarray is continuous.
assert run("""\
1
5
9 9 9 9 9
""") == "Case #1: 15", "all equal values"

# Missing integer in the pair, then restored by the third value.
assert run("""\
1
3
1 3 2
""") == "Case #1: 5", "missing integer"

# Large value gap. Only the singleton intervals are valid.
assert run("""\
1
2
1 1000000000
""") == "Case #1: 2", "boundary values"

# Duplicates must not be counted as additional distinct values.
assert run("""\
1
4
1 2 2 3
""") == "Case #1: 10", "duplicates"

# Maximum-size case, also checks that the answer exceeds 32-bit range.
n = 100000
maximum_case = "1\n" + str(n) + "\n" + ("7 " * (n - 1)) + "7\n"
assert run(maximum_case) == "Case #1: 5000050000", "maximum-size all-equal case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1 / 7`|`Case #1: 1`| 最小输入和单例处理 |
 |`1 / 5 / 9 9 9 9 9`|`Case #1: 15`| 当所有值都相等时，每个子数组仍然有效 |
 |`1 / 3 / 1 3 2`|`Case #1: 5`| 缺少整数可能会使间隔无效，然后在扩展后有效 |
 |`1 / 2 / 1 1000000000`|`Case #1: 2`| 价值差距非常大|
 |`1 / 4 / 1 2 2 3`|`Case #1: 10`| 正确处理重复项|
 | (n=100000)，所有值`7`|`Case #1: 5000050000`| 最大输入大小和大答案 |

 ## 边缘情况

 对于重复值的情况```
1
2
1 1
```第一个位置产生 (F(1,1)=1-1-1=-1)。 在第二个位置，最大值和最小值不变。 (1) 的上一次出现位置为 (1)，因此非重复计数更新仅影响左端点 (2)。 因此，两个叶子节点都具有值 (-1)，并且线段树报告两个在位置 (2) 结束的有效区间。 与第一个单例一起，答案是（3）。 

对于缺失值的情况```
1
2
1 3
```结束于位置 (2) 且左端点 (1) 的区间具有 (mx=3)、(mn=1) 和 (cnt=2)，给出 (F=0)。 单例 ([3]) 有 (F=-1)。 因此，线段树的最小值仍然是 (-1)，但只有一个叶子达到它。 总答案是（1+1=2）。 

对于重复填充的范围```
1
4
1 2 2 3
```完整区间有 (mx=3)、(mn=1) 和 (cnt=3)，因此其值为 (-1)。 重复的 (2) 既不会改变最小计数，也不会改变不同计数。 同样的推理适用于每个较短的间隔，给出十个有效的子数组。 

对于最大大小等值情况，每个子数组都有 (mx=mn) 和 (cnt=1)，因此每个左端点都有 (F=-1)。 在每个右端点 (r) 处，线段树最小计数恰好为 (r)。 对 (1+2+\cdots+100000) 求和得到 (5,000,050,000)，这证实了计数逻辑以及对能够保存完整结果的整数类型的需求。
