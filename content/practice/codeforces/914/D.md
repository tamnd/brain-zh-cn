---
title: "CF 914D - Bash 和一道艰巨的数学难题"
description: "我们维护一个支持两种操作的数组。 第一个操作询问段 [l, r] 和值 x。 我们想知道是否可以最多修改该段内的一个元素，使得整个段的 gcd 恰好变为 x。"
date: "2026-06-13T01:23:46+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 914
codeforces_index: "D"
codeforces_contest_name: "Codecraft-18 and Codeforces Round 458 (Div. 1 + Div. 2, combined)"
rating: 1900
weight: 914
solve_time_s: 240
verified: true
draft: false
---

[CF 914D - Bash 和一个艰难的数学难题](https://codeforces.com/problemset/problem/914/D)

 **评级：** 1900
 **标签：** 数据结构，数论
 **求解时间：** 4m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护一个支持两种操作的数组。 

第一个操作询问一个段`[l, r]`和一个值`x`。 我们想知道是否可以最多修改该段内的一个元素，从而使整个段的 gcd 恰好变为`x`。 

第二个操作永久更新一个数组位置。 

挑战在于数组大小和查询数量都非常大。 该数组最多包含`5 · 10^5`元素，最多可以有`4 · 10^5`运营。 任何为每个查询扫描整个段的解决方案都是不可能的。 最坏情况下的段长度是`5 · 10^5`，因此每个查询的线性扫描需要大约`2 · 10^11`运营。 

关键的观察隐藏在短语“最多改变一个元素”内。 

假设我们希望该段的最终 gcd 为`x`。 每个未改变的元素必须可以被整除`x`，因为 gcd 划分了该段的每个元素。 如果两个不同的位置不能被整除`x`，一项修改无法同时解决这两个问题。 这意味着当段最多包含一个不能被整除的元素时，查询恰好有效`x`。 

一些边缘情况很容易被忽略。 

考虑：```
3
6 12 18
1
1 1 3 6
```每个元素都可以整除`6`，所以答案是`YES`。 我们不需要修改任何东西。 短语“至多一次改变”包括零次改变。 

现在考虑：```
3
6 10 15
1
1 1 3 5
```仅有的`6`不能被整除`5`。 将单个元素更改为之后`5`，该段可以变成`[5,10,15]`，其最大公约数为`5`。 答案是`YES`。 

最后：```
3
6 10 14
1
1 1 3 5
```两个都`6`和`14`不能被整除`5`。 一项修改不能使两者整除`5`，所以答案是`NO`。 

一个常见的错误是检查当前段 gcd 是否可以以某种方式转换为`x`。 实际情况取决于有多少元素不能被整除`x`，不仅仅在当前的 gcd 上。 

## 方法

 暴力解决方案将处理查询`(l, r, x)`通过扫描段中的每个元素并计算有多少个元素不能被整除`x`。 

逻辑是正确的。 如果计数最多为 1，请回答`YES`; 否则回答`NO`。 

问题是速度。 一个段可能包含`5 · 10^5`元素，并且可能有`4 · 10^5`查询。 在最坏的情况下，这大约变成`2 · 10^11`可分性检查。 

我们需要一种方法来更快地计算“坏”元素。 

重要的观察是整除`x`可以通过gcd来检测。 对于任何范围，如果范围 gcd 可以被整除`x`，那么该范围内的每个元素都可以被整除`x`。 

这表明线段树存储范围 gcd。 

假设我们检查一个段`[l, r]`。 

如果`gcd(l, r)`可以整除`x`，那么段中的每个元素都可以被整除`x`，答案是立即`YES`。 

否则，段内某处存在一个不能被整除的元素`x`。 

我们不是检查每个元素，而是沿线段树下降。 每当节点的 gcd 可以被整除时`x`，我们知道它的整个区间是干净的并且可以跳过。 我们只继续进入 gcd 不能被整除的节点`x`。 

一旦我们发现不止一种违规元素，我们就会停止。 

这就把问题变成了寻找元素的数量是否不能被整除`x`至多是一个。 线段树使我们能够有效地定位这些元素，因为大的干净间隔会立即被丢弃。 

更新是标准线段树点更新。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个查询 O(n) | O(1) | O(1) | 太慢了 |
 | 最优线段树| 每次查询 O(log² n)，更新 O(log n) | O(n) | 已接受 |

 ## 算法演练

 1. 构建一棵线段树，每个节点存储其区间的 gcd。 
2. 对于更新查询`(i, y)`,更新位置对应的叶子`i`并重新计算返回根的路径上的 gcd 值。 
3. 查询查询`(l, r, x)`，判断段是否最多包含一个不能被整除的元素`x`。 
4. 递归遍历线段树。 
5、如果当前节点区间不相交`[l, r]`，返回零个坏元素。 
6. 如果当前节点完全包含在`[l, r]`它存储的 gcd 可以被整除`x`，返回零个坏元素。 

该区间中的每个元素都可以被整除`x`，因此那里不能存在违规元素。 
7. 如果当前节点代表单个位置并且其gcd不能被整除`x`，返回一个坏元素。 
8.否则分成两个孩子继续寻找。 
9. 持续统计不良元素。 当计数超过一时，停止探索并返回任何大于一的值。 
10.遍历完后，回答`YES`如果计数最多为一，否则回答`NO`。 

### 为什么它有效

 对于任意区间，如果它的 gcd 可以被整除`x`，那么该区间中的每个元素都可以被整除`x`。 这样的区间不能包含坏元素，可以完全忽略。 

每当节点 gcd 不能被整除时`x`，该区间内至少有一个元素不能被`x`，因此有必要深入到其子级。 

递归最终精确地到达那些其值不能被整除的叶子`x`。 该算法会对它们进行计数，一旦发现多个就会停止。 

一个段可以转化为有gcd`x`最多使用一个修改当且仅当最多一个元素不能被整除`x`。 如果有两个或多个这样的元素，则必须对每个元素进行修改，这是不可能的。 如果有零个或一个这样的元素，则适当地更改该单个元素总是允许整个段 gcd 变为`x`。 

## Python 解决方案```python
import sys
from math import gcd

input = sys.stdin.readline

class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.seg = [0] * (4 * self.n)
        self._build(1, 0, self.n - 1, arr)

    def _build(self, node, left, right, arr):
        if left == right:
            self.seg[node] = arr[left]
            return

        mid = (left + right) // 2
        self._build(node * 2, left, mid, arr)
        self._build(node * 2 + 1, mid + 1, right, arr)
        self.seg[node] = gcd(
            self.seg[node * 2],
            self.seg[node * 2 + 1]
        )

    def update(self, node, left, right, idx, value):
        if left == right:
            self.seg[node] = value
            return

        mid = (left + right) // 2

        if idx <= mid:
            self.update(node * 2, left, mid, idx, value)
        else:
            self.update(node * 2 + 1, mid + 1, right, idx, value)

        self.seg[node] = gcd(
            self.seg[node * 2],
            self.seg[node * 2 + 1]
        )

    def count_bad(self, node, left, right, ql, qr, x):
        if left > qr or right < ql:
            return 0

        if self.seg[node] % x == 0:
            return 0

        if left == right:
            return 1

        mid = (left + right) // 2

        res = self.count_bad(
            node * 2,
            left,
            mid,
            ql,
            qr,
            x
        )

        if res > 1:
            return res

        res += self.count_bad(
            node * 2 + 1,
            mid + 1,
            right,
            ql,
            qr,
            x
        )

        return min(res, 2)

def solve():
    n = int(input())
    arr = list(map(int, input().split()))

    st = SegmentTree(arr)

    q = int(input())
    ans = []

    for _ in range(q):
        query = list(map(int, input().split()))

        if query[0] == 1:
            _, l, r, x = query
            bad = st.count_bad(1, 0, n - 1, l - 1, r - 1, x)
            ans.append("YES" if bad <= 1 else "NO")
        else:
            _, idx, value = query
            st.update(1, 0, n - 1, idx - 1, value)

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```线段树每个区间存储一个值，即它的 gcd。 构建树需要线性时间。 

更新操作是完全标准的。 我们修改一个叶子并重新计算 gcd 值，同时返回到根。 

有趣的部分是`count_bad`。 每当节点 gcd 可以被整除时`x`，整个区间已知是干净的，因此递归立即停止。 这种修剪使得解决方案变得更快。 

返回值上限为`2`。 查询只关心违规元素的数量是否为`0`,`1`，或者至少`2`。 没有理由计算除此之外的数。 

树中的所有索引都是从零开始的，而输入是从一开始的。 转换`l - 1`,`r - 1`， 和`idx - 1`是必不可少的。 

Python 整数可以轻松处理高达`10^9`，所以溢出永远不是问题。 

## 工作示例

 ### 示例 1

 输入：```
3
2 6 3
4
1 1 2 2
1 1 3 3
2 1 9
1 1 3 2
```第一个查询：`(1,2,2)`。 

| 间隔 | GCD | 能被2整除吗？ | 行动|
 | --- | --- | --- | --- |
 | [1,2]| 2 | 是的 | 停止|
 | 错误计数 | 0 | | 是 |

 第二次查询：`(1,3,3)`。 

| 间隔 | GCD | 能被3整除吗？ | 行动|
 | --- | --- | --- | --- |
 | [1,3]| 1 | 没有 | 下降 |
 | [1,2]| 2 | 没有 | 下降 |
 | [1,1]| 2 | 没有 | 坏元素|
 | [2,2]| 6 | 是的 | 清洁|
 | [3,3]| 3 | 是的 | 清洁|

 错误计数等于`1`，所以答案是`YES`。 

更新位置后`1`到`9`，数组变为`[9,6,3]`。 

第三次查询：`(1,3,2)`。 

| 间隔 | GCD | 能被2整除吗？ | 行动|
 | --- | --- | --- | --- |
 | [1,3]| 3 | 没有 | 下降 |
 | [1,1]| 9 | 没有 | 坏|
 | [3,3]| 3 | 没有 | 坏|

 至少存在两个坏因素，所以答案是`NO`。 

这个例子说明了为什么我们只需要计算不能被整除的元素`x`。 

### 自定义示例

 输入：```
4
10 15 20 25
1
1 1 4 5
```| 间隔 | GCD | 能被5整除吗？ | 行动|
 | --- | --- | --- | --- |
 | [1,4]| 5 | 是的 | 停止|

 根区间已经证明每个元素都可以被整除`5`。 

错误计数是`0`，所以答案是`YES`。 

这展示了最强的修剪情况，其中查询在根处完成而根本没有下降。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每次类型 1 查询为 O(log² n)，每次更新为 O(log n) | 线段树遍历只访问对数个相关节点 |
 | 空间| O(n) | 线段树存储 |

 和`n ≤ 5 · 10^5`和`q ≤ 4 · 10^5`，这些界限完全符合限制。 公认的 Codeforces 解决方案正是使用了这种线段树 gcd 策略。 

## 测试用例```python
import sys
import io
from math import gcd

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    class SegmentTree:
        def __init__(self, arr):
            self.n = len(arr)
            self.seg = [0] * (4 * self.n)
            self.build(1, 0, self.n - 1, arr)

        def build(self, p, l, r, arr):
            if l == r:
                self.seg[p] = arr[l]
                return
            m = (l + r) // 2
            self.build(p * 2, l, m, arr)
            self.build(p * 2 + 1, m + 1, r, arr)
            self.seg[p] = gcd(self.seg[p * 2], self.seg[p * 2 + 1])

        def update(self, p, l, r, idx, val):
            if l == r:
                self.seg[p] = val
                return
            m = (l + r) // 2
            if idx <= m:
                self.update(p * 2, l, m, idx, val)
            else:
                self.update(p * 2 + 1, m + 1, r, idx, val)
            self.seg[p] = gcd(self.seg[p * 2], self.seg[p * 2 + 1])

        def query(self, p, l, r, ql, qr, x):
            if l > qr or r < ql:
                return 0
            if self.seg[p] % x == 0:
                return 0
            if l == r:
                return 1
            m = (l + r) // 2
            res = self.query(p * 2, l, m, ql, qr, x)
            if res > 1:
                return res
            res += self.query(p * 2 + 1, m + 1, r, ql, qr, x)
            return min(res, 2)

    n = int(input())
    arr = list(map(int, input().split()))
    st = SegmentTree(arr)

    q = int(input())
    out = []

    for _ in range(q):
        t = list(map(int, input().split()))
        if t[0] == 1:
            _, l, r, x = t
            out.append(
                "YES"
                if st.query(1, 0, n - 1, l - 1, r - 1, x) <= 1
                else "NO"
            )
        else:
            _, i, y = t
            st.update(1, 0, n - 1, i - 1, y)

    return "\n".join(out)

# sample 1
assert run(
"""3
2 6 3
4
1 1 2 2
1 1 3 3
2 1 9
1 1 3 2
"""
) == "YES\nYES\nNO"

# minimum size
assert run(
"""1
7
1
1 1 1 7
"""
) == "YES"

# one bad element
assert run(
"""3
6 10 15
1
1 1 3 5
"""
) == "YES"

# two bad elements
assert run(
"""3
6 10 14
1
1 1 3 5
"""
) == "NO"

# update affects answer
assert run(
"""2
6 12
3
1 1 2 6
2 2 7
1 1 2 6
"""
) == "YES\nYES"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素数组 | 是 | 最小边界 |
 | 6 10 15 x=5 | 6 10 15 是 | 恰好有一个违规元素 |
 | 6 10 14 x=5 | 6 10 14 x=5 | 否 | 两个违规分子 |
 | 更新然后查询 | 是的 是的 | 正确的更新传播 |

 ## 边缘情况

 考虑：```
1
7
1
1 1 1 7
```唯一的元素已经可以被整除`7`。 根节点的gcd为`7`，可除以`7`，所以算法立即返回零坏元素和答案`YES`。 

考虑：```
3
6 10 15
1
1 1 3 5
```仅有价值`6`不能被整除`5`。 递归最终准确地识别出一个坏叶子。 由于计数是`1`，算法答案`YES`。 我们可以将该元素更改为`5`，使线段 gcd 等于`5`。 

考虑：```
3
6 10 14
1
1 1 3 5
```两个都`6`和`14`不能整除`5`。 递归找到一个坏叶子，继续，找到第二个坏叶子，然后停止。 计数超过一，所以答案是`NO`。 

考虑更新敏感的情况：```
2
6 12
3
1 1 2 6
2 2 7
1 1 2 6
```第一个查询成功，因为两个值都可以整除`6`。 更新后，数组变为`[6,7]`。 只有一个元素不能被整除`6`，所以第二个查询仍然成功。 线段树更新正确地传播了新的 gcd 信息，允许后续查询使用修改后的数组状态。
