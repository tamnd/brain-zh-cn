---
title: "CF 102440D-\u041f\u0435\u0442\u044f\u0438\u043c\u0430\u0441\u0441\u0438\u0432"
description: "我们有一个数组 (a) 和一个非负阈值 (k)。 如果一个子数组在删除最多一个元素后，其最大值减去其最小值最多可达 (k)，则该子数组被称为美丽的。"
date: "2026-08-08T13:46:11+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102440
codeforces_index: "D"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Junior"
rating: 0
weight: 102440
solve_time_s: 166
verified: true
draft: false
---

[CF 102440D - \u041f\u0435\u0442\u044f \u0438\u043c\u0430\u0441\u0441\u0438\u0432](https://codeforces.com/problemset/problem/102440/D)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个数组 (a) 和一个非负阈值 (k)。 如果一个子数组在删除最多一个元素后，其最大值减去其最小值最多可达 (k)，则该子数组被称为美丽的。 查询 ([L,R]) 询问具有 (L\le l<r\le R) 的对 ((l,r)) 的数量，使得子数组 (a_l,\ldots,a_r) 很漂亮。 

“最多删除一个元素”这句话让这个问题变得有趣。 如果原始范围已经至多(k)，则不需要删除任何内容。 否则，删除一个元素仅在该元素是唯一最小值或唯一最大值时才有帮助。 如果最小值出现两次，则删除一个最小值会留下具有相同值的另一副本。 这同样适用于最大值。 

假设一个窗口具有最小值 (mn)、最大值 (mx)、第二小元素 (mn_2) 和第二大元素 (mx_2)，其中当极值出现至少两次时，允许第二个值等于相应的极值。 窗外正是美丽的时候

 [
 mx-mn\le k,
 ]

 或者最大值恰好出现一次并且

 [
 mx_2-mn\le k,
 ]

 或者最小值恰好出现一次并且

 [
 mx-mn_2\le k。 
]

 这些约束排除了检查每个查询的所有子数组的算法。 长度为 (2\cdot10^5) 的数组中几乎有 (2\cdot10^{10}) 对端点，因此即使对每个子数组进行 (O(1)) 检查也已经太昂贵了。 我们需要利用这样一个事实：美丽的子数组是可遗传的：美丽数组的每个子数组也是美丽的。 这给出了两指针扫描所需的单调结构。 

有几种边缘情况很容易被错误处理。 

考虑```
2 1 4
0 10
1 2
```答案是（1）。 区间 ([1,2]) 的范围为 (10)，它大于 (4)，但删除任一元素都会留下范围为 (0) 的单例。 仅检查的实现`max - min <= k`会错误地输出 (0)。 

现在考虑```
4 1 0
0 0 10 10
1 4
```答案是（4）。 整个区间并不美观，因为删除一个零留下一个（10），删除一个十留下一个（0），所以剩下的范围是（10）。 不过，([1,3])删掉十就美了，([2,4])删了零就美了。 两个等值对 ([1,2]) 和 ([3,4]) 也很漂亮。 将第二个极端视为不同值而不跟踪多重性的粗心实现可能会做出错误的删除决定。 

长度为一的查询是另一种边界情况。 例如，```
1 1 0
7
1 1
```答案为 (0)，因为该问题只要求 (l<r)。 虽然单例总是很漂亮，但它永远不会被算作请求的子数组。 

## 方法

 直接的方法是枚举每个查询中的每对端点，并确定该子数组是否漂亮。 对于覆盖整个数组的一个查询，这意味着检查

 [
 \frac{n(n-1)}2
 ]

 候选区间。 在 (n=200000) 处，即 (19,999,900,000) 间隔。 即使美感测试很神奇（O(1)），这也已经远远超出了极限。 如果扫描每个区间以找到其极值，则成本将是立方的。 

蛮力是正确的，因为它从字面上检查每个可能对 ((l,r)) 的定义，但它完全忽略相邻子数组之间的重叠。 当我们将窗口扩展一个元素时，几乎所有内容都保持不变。 当其左端点移动一个位置时也是如此。 

关键的观察是，在缩小的情况下，美是单调的。 如果一个子数组很漂亮，则选择删除使其范围最多为（k）的元素。 任何较小的子数组要么不包含该元素，在这种情况下其范围已经由同一参数界定，要么它包含该元素，我们可以再次删除它。 因此，每个较小的子数组都是美丽的。 

这意味着对于每个固定的右端点 (r)，都有一个最小的左端点 (f[r])，使得 ([f[r],r]) 很漂亮。 每个区间 ([l,r]) 和 (l\ge f[r]) 都是美丽的。 当 (r) 向右移动时，(f[r]) 永远不会向左移动。 

我们可以通过滑动窗口找到所有 (f[r])。 剩下的唯一困难是测试当前窗口是否美观。 单调最小双端队列给出最小值，单调最大双端队列给出最大值。 通过值的频率，我们可以确定当前最小值或最大值是否出现一次。 如果一个极值是唯一的，则相应单调双端队列的第二个条目给出下一个不同的极值。 

计算 (f[r]) 后，查询就变成一维计数问题。 由于 (f[r]) 是非递减的，二分搜索可以将每个查询拆分为 (f[r]\le L) 的位置和 (f[r]>L) 的位置。 然后，前缀和在二分搜索后使两个部分的时间恒定。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(qn^2)) 即使有 (O(1)) 美丽测试 | (O(n^2)) 如果测试是预先计算的 | 太慢了|
 | 最佳 | (O(n+q\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 从左到右处理数组的同时保持一个滑动窗口([left,r])。 当我们完成收缩后，该窗口将始终是以 (r) 结尾的最小的美丽窗口。 
2. 保持最小值的索引单调递增双端队列和最大值的索引单调递减双端队列。 当插入新值时，从后面删除永远不会再次成为最小值或最大值的索引。 由于两个端点仅向前移动，因此每个索引最多进入和离开每个双端队列一次。 
3. 维护窗口内当前值的频率字典。 需要频率，因为即使双端队列仅存储该值的一个代表，最小双端队列前面的值也可能出现多次。 
4. 测试当前窗口。 令 (mn) 和 (mx) 为其最小值和最大值。 如果(mx-mn\le k)，窗户直接漂亮了。 
5. 如果(mx-mn>k)，唯一可能成功删除的是唯一极值。 如果最大值出现一次，则删除它，留下第二大的值作为新的最大值。 如果结果范围 (mx_2-mn) 至多 (k)，则窗口很漂亮。 对称地，如果最小值出现一次且 (mx-mn_2\le k)，则窗口很漂亮。 
6.如果窗户不漂亮，增加`left`并从窗口中删除 (a[left])。 删除的值将从频率字典中删除，并且必要时从任一双端队列的前面删除其索引。 重复直到窗户变得漂亮。 
7. 存储结果`left`作为(f[r])。 由于先前的窗口对于 (r-1) 来说已经是最小的，因此添加新元素无法使先前无效的较小左端点再次有效。 因此，序列 (f[0],f[1],\ldots,f[n-1]) 是非递减的。 
8. 构建索引和 (f[r]) 的前缀和。 对于查询 ([L,R])，如果 (f[r]\le L)，端点 (r) 贡献从 (L) 到 (r-1) 的所有有效左端点。 那么它的贡献就是(r-L)。 
9. 如果 (f[r]>L)，则有效左端点从 (f[r]) 开始，因此贡献为 (r-f[r])。 由于 (f[r]) 是非递减的，因此二分查找会通过 (f[r]>L) 查找查询中的第一个 (r)。 
10. 使用前缀和来评估查询的两个部分。 单例端点 (r=L) 自动贡献零，因此不需要单独的特殊情况。 

### 为什么它有效

 对于每个右端点 (r)，滑动窗口不变式是收缩后，([f[r],r]) 是美丽的，而每个 (l<f[r]) 的区间 ([l,r]) 则不是。 当区间缩小时，美丽得以保留，因此从 (f[r]) 到 (r) 开始的所有区间都会产生美丽的区间。 该查询仅排除单例 (l=r)，仅保留 (r-\max(L,f[r])) 有效开始。 

单调双端队列给出当前的最小值和最大值。 它们前面的条目代表极值，而一旦相应的极值唯一，接下来的条目就会给出下一个候选值。 频率字典区分独特的极端情况和重复的极端情况。 因此，美丽测试完全符合定义。 

最后，左边界仅向右移动，因此 (f[r]) 不减。 这使得查询拆分有效，并允许一次二分搜索通过 (f[r]\le L) 识别所有端点。 

## Python 解决方案```python
import sys
from bisect import bisect_right
from collections import deque

input = sys.stdin.readline

def solve():
    n, q, k = map(int, input().split())
    a = list(map(int, input().split()))

    minq = deque()
    maxq = deque()
    freq = {}

    f = [0] * n
    left = 0

    def add(i):
        x = a[i]

        while minq and a[minq[-1]] >= x:
            minq.pop()
        minq.append(i)

        while maxq and a[maxq[-1]] <= x:
            maxq.pop()
        maxq.append(i)

        freq[x] = freq.get(x, 0) + 1

    def remove(i):
        x = a[i]

        freq[x] -= 1
        if freq[x] == 0:
            del freq[x]

        while minq and minq[0] < left:
            minq.popleft()

        while maxq and maxq[0] < left:
            maxq.popleft()

    def beautiful():
        mn = a[minq[0]]
        mx = a[maxq[0]]

        if mx - mn <= k:
            return True

        if freq[mx] == 1:
            mx2 = a[maxq[1]]
            if mx2 - mn <= k:
                return True

        if freq[mn] == 1:
            mn2 = a[minq[1]]
            if mx - mn2 <= k:
                return True

        return False

    for r in range(n):
        add(r)

        while not beautiful():
            left += 1
            remove(left - 1)

        f[r] = left

    pref_index = [0] * (n + 1)
    pref_f = [0] * (n + 1)

    for i in range(n):
        pref_index[i + 1] = pref_index[i] + i
        pref_f[i + 1] = pref_f[i] + f[i]

    out = []

    for _ in range(q):
        L, R = map(int, input().split())
        L -= 1
        R -= 1

        # First position p in [L, R] with f[p] > L.
        p = bisect_right(f, L, lo=L, hi=R + 1)

        # For r in [L, p), contribution is r - L.
        count1 = p - L
        sum_r1 = pref_index[p] - pref_index[L]
        ans = sum_r1 - count1 * L

        # For r in [p, R], contribution is r - f[r].
        sum_r2 = pref_index[R + 1] - pref_index[p]
        sum_f2 = pref_f[R + 1] - pref_f[p]
        ans += sum_r2 - sum_f2

        out.append(str(ans))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`minq`双端队列存储其值在每次插入后严格增加的索引。 当新值小于或等于后面的值时，那些旧索引永远不会成为最小值，而新索引仍保留在窗口中，因此它们将被丢弃。`maxq`使用对称规则。 

频率字典故意与双端队列分开。 相等的最小值在双端队列中被折叠，但它们的多样性仍然很重要。 例如，如果当前最小值为 (0) 并且出现了 3 次，则删除一次并不能从窗口中删除 (0)。 字典准确地检测到了这种情况。 

这`remove`函数使用当前全局`left`边界。 索引可能已经从双端队列中消失，因为稍后插入了更好的候选索引，因此清理被写为`while`循环而不是假设删除的索引存在。 

美颜测试先检查普通范围。 只有当范围太大时，它才会检查独特的极端情况。 如果最大值是唯一的，`maxq[1]`是下一个最大值。 如果最小值是唯一的，`minq[1]`是下一个最小值。 这些检查是安全的，因为每当第一个范围检查失败时，当前窗口至少有两个不同的值。 

数组`f`使用从零开始的索引。 对于固定端点 (r)，如果`f[r] <= L`，从 (L) 到 (r-1) 的每个起点都有效，给出 (r-L) 个选择。 否则，起始位置为 (f[r]) 到 (r-1)，给出 (r-f[r]) 个选择。 索引的前缀和处理第一个表达式，而索引的前缀和处理`f`处理第二个。 

Python 整数具有任意精度，因此答案不会溢出。 最大可能的答案大约是 (n^2/2)，对于 (n=2\cdot10^5) 来说大约是 (2\cdot10^{10})。 

## 工作示例

 ### 示例 1

 输入数组是

 [
 [0,10,10,2,4]
 ]

 与(k=4)。 下表显示了窗口根据需要缩小后的状态。 

| (r)| 当前窗口| 最低 | 最大| 分钟计数 | 最大计数 | (f[r]) | (f[r]) |
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | [0]| 0 | 0 | 1 | 1 | 0 |
 | 1 | [0,10]| 0 | 10 | 10 1 | 1 | 0 |
 | 2 | [0,10,10]| 0 | 10 | 10 1 | 2 | 0 |
 | 3 | [10,10,2]| 2 | 10 | 10 1 | 2 | 1 |
 | 4 | [10,2,4]| 2 | 10 | 10 1 | 1 | 2 |

 在 (r=1) 时，范围为 (10)，但最大值是唯一的，因此删除它只留下 (0)。 (r=2)时，最大值出现两次，但最小值是唯一的，因此删除最小叶子`[10,10]`。 在 (r=3) 处，`[0,10,10,2]`不太漂亮，所以左端点前进到（1）。 由此产生的`[10,10,2]`删除(2)就变得漂亮了。 

得到的边界数组是

 [
 f=[0,0,0,1,2]。 
]

 对于查询 ([1,5])，端点 (2) 贡献 (1)，端点 (3) 贡献 (2)，端点 (4) 贡献 (2)，端点 (5) 贡献 (2)。 它们的总和是(7)。 

### 示例 2

 这里的数组是

 [
 [0,10,1,2,4]
 ]

 (k=4)。 

| (r)| 当前窗口| 最低 | 最大| 分钟计数 | 最大计数 | (f[r]) | (f[r]) |
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | [0]| 0 | 0 | 1 | 1 | 0 |
 | 1 | [0,10]| 0 | 10 | 10 1 | 1 | 0 |
 | 2 | [0,10,1]| 0 | 10 | 10 1 | 1 | 0 |
 | 3 | [0,10,1,2] | 0 | 10 | 10 1 | 1 | 0 |
 | 4 | [0,10,1,2,4] | 0 | 10 | 10 1 | 1 | 0 |

 在 (r=4) 处，整个数组很漂亮，因为删除唯一的最大值 (10) 会留下从 (0) 到 (4) 的值，其范围恰好是 (k)。 因此，每个端点都有 (f[r]=0)，并且每个长度至少为 2 的非空区间都是美丽的。 

有

 [
 1+2+3+4=10
 ]

 这样的子数组，与样本输出匹配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n+q\log n)) | 每个数组索引进入和离开每个单调双端队列一次，而每个查询执行一次二分搜索。 |
 | 空间| (O(n)) | (O(n)) | 双端队列、频率字典、边界数组和两个前缀数组都使用线性空间。 |

 预处理是线性的，因为两个指针和两个双端队列仅向前移动。 每个查询的查询阶段成本为 (O(\log n))，因为`f`按非降序排序。 对于 (n,q\le2\cdot10^5)，这给出了大约 (O(n+q\log n)) 次操作，并且在规定限制的预期复杂度内保持舒适。 

## 测试用例```python
import sys
import io
from bisect import bisect_right
from collections import deque

def solve():
    input = sys.stdin.readline

    n, q, k = map(int, input().split())
    a = list(map(int, input().split()))

    minq = deque()
    maxq = deque()
    freq = {}

    f = [0] * n
    left = 0

    def add(i):
        x = a[i]

        while minq and a[minq[-1]] >= x:
            minq.pop()
        minq.append(i)

        while maxq and a[maxq[-1]] <= x:
            maxq.pop()
        maxq.append(i)

        freq[x] = freq.get(x, 0) + 1

    def remove(i):
        x = a[i]
        freq[x] -= 1
        if freq[x] == 0:
            del freq[x]

        while minq and minq[0] < left:
            minq.popleft()

        while maxq and maxq[0] < left:
            maxq.popleft()

    def beautiful():
        mn = a[minq[0]]
        mx = a[maxq[0]]

        if mx - mn <= k:
            return True

        if freq[mx] == 1 and a[maxq[1]] - mn <= k:
            return True

        if freq[mn] == 1 and mx - a[minq[1]] <= k:
            return True

        return False

    for r in range(n):
        add(r)

        while not beautiful():
            left += 1
            remove(left - 1)

        f[r] = left

    pref_index = [0] * (n + 1)
    pref_f = [0] * (n + 1)

    for i in range(n):
        pref_index[i + 1] = pref_index[i] + i
        pref_f[i + 1] = pref_f[i] + f[i]

    ans = []

    for _ in range(q):
        L, R = map(int, input().split())
        L -= 1
        R -= 1

        p = bisect_right(f, L, lo=L, hi=R + 1)

        count1 = p - L
        sum_r1 = pref_index[p] - pref_index[L]
        cur = sum_r1 - count1 * L

        sum_r2 = pref_index[R + 1] - pref_index[p]
        sum_f2 = pref_f[R + 1] - pref_f[p]
        cur += sum_r2 - sum_f2

        ans.append(str(cur))

    sys.stdout.write("\n".join(ans))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample 1
assert run(
    """5 1 4
0 10 10 2 4
1 5
"""
) == "7", "sample 1"

# Provided sample 2
assert run(
    """5 1 4
0 10 1 2 4
1 5
"""
) == "10", "sample 2"

# Minimum-size input. A singleton is never counted.
assert run(
    """1 1 0
7
1 1
"""
) == "0", "minimum-size input"

# Maximum-size input. All values are equal, so every interval is beautiful.
n = 200000
expected = n * (n - 1) // 2
big_input = f"200000 1 0\n{' '.join(['7'] * n)}\n1 200000\n"
assert run(big_input) == str(expected), "maximum-size input"

# Repeated minimum and maximum. The full interval is not beautiful,
# while [1,3] and [2,4] become beautiful by deleting one extreme.
assert run(
    """4 1 0
0 0 10 10
1 4
"""
) == "4", "repeated extremes"

# Boundary query. This is a suffix of sample 1 and catches query
# conversion and f[r] boundary mistakes.
assert run(
    """5 1 4
0 10 10 2 4
2 5
"""
) == "5", "query boundary"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 0 / 7 / 1 1`|`0`| 单例查询不得计算长度为 1 的子数组。 |
 |`200000 1 0`所有值都相等 |`19999900000`| 最大值 (n)、最大答案大小、前缀和和线性预处理。 |
 |`4 1 0 / 0 0 10 10 / 1 4`|`4`| 重复的最小值和最大值不得被视为独特的极端值。 |
 | 带查询的示例 1`2 5`|`5`| 查询边界以及从从一开始的索引到从零开始的索引的转换。 |

 ## 边缘情况

 第一个边缘情况是范围大于 (k) 的二元素区间。 为了```
2 1 4
0 10
1 2
```当前窗口`[0,10]`范围为 (10)，因此第一个美容条件失败。 两个极端都是独一无二的。 删除其中任何一个都会留下一个单例，其范围为 (0)。 因此该算法保持`left=0`，记录 (f[1]=0)，并且查询计算一对有效的 ((1,2))。 

第二种边缘情况涉及重复的极端情况：```
4 1 0
0 0 10 10
1 4
```当存在完整窗口时，最小值和最大值都会出现两次。 普通范围是（10>0），但是这两个极端都不能通过一次删除来删除，因为还保留了另一个副本。 该算法正确地拒绝窗口并移动`left`。 最终得到两个漂亮的较长间隔`[0,0,10]`和`[0,10,10]`, 连同`[0,0]`和`[10,10]`，给出（4）。 

第三种边缘情况是长度为一的查询：```
1 1 0
7
1 1
```预处理记录（f[0]=0），因为单例很漂亮。 然而，在查询期间，端点 (r=L) 的贡献为 (r-L=0)。 因此，无需特殊的查询分支即可正确排除单例。 

第四种边缘情况是每个值都相等的情况。 为了```
4 1 0
7 7 7 7
1 4
```每个窗口的范围都为零，因此第一个条件立即成功。 边界数组是`[0,0,0,0]`，查询计算 (1+2+3=6) 个长度大于 1 的子数组。 这也验证了当普通范围已经满足阈值时，永远不需要第二极端逻辑。 

第五个边缘情况是删除最小值是唯一有效的操作。 在示例 1 中，窗口`[0,10,10]`最大值 (10) 有两次，因此删除一个最大值并不能删除大值。 最小值（0）是唯一的，删除它留下`[10,10]`。 该算法使用最大值的频率来拒绝第一个删除方向，并使用最小值的频率来接受第二个删除方向。 这种区别是频率词典必要的核心原因。
