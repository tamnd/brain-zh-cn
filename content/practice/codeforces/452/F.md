---
title: "CF 452F - 排列"
description: "我们得到了数字 1...n 的排列。 对于两个不同的值 a 和 b，它们的平均值为 (a+b)/2。 由于排列只包含每个整数一次，因此只要 a+b 为偶数，该平均值也会出现。"
date: "2026-06-07T17:10:09+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "divide-and-conquer", "hashing"]
categories: ["algorithms"]
codeforces_contest: 452
codeforces_index: "F"
codeforces_contest_name: "MemSQL Start[c]UP 2.0 - Round 1"
rating: 2700
weight: 452
solve_time_s: 174
verified: true
draft: false
---

[CF 452F - 排列](https://codeforces.com/problemset/problem/452/F)

 **评分：** 2700
 **标签：** 数据结构、分而治之、哈希
 **求解时间：** 2m 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了数字的排列`1...n`。 对于两个不同的值`a`和`b`，他们的平均值是`(a+b)/2`。 由于排列只包含每个整数一次，因此每当`a+b`是均匀的。 

问题是是否存在一对`a, b`使得它们的平均值在排列顺序中出现在它们之间。 

更有用的重新表述是查看价值空间中的算术级数。 让$$a = x-k,\qquad b = x+k.$$然后`x`正好是平均值`a`和`b`。 任务变为：

 是否存在一个值`x`和一段距离`k > 0`使得`x`在排列中严格位于以下位置之间`x-k`和`x+k`？ 

排列的大小可以达到`300000`。 任何显式检查所有对或所有算术级数的算法都会立即被排除。 甚至一个`O(n^2)`解决方案大约需要`9·10^{10}`最坏情况下的操作，远远超出了极限。 

棘手的部分是条件混合了两种不同的顺序。 值按算术级数顺序进行比较，而“之间”指的是排列内的位置。 

考虑排列```
1 5 2 4 3
```价值`2`位于之间`1`和`3`，所以答案是`YES`。 

现在考虑```
1 3 4 2
```为了唯一可能的进展`(1,2,3)`，值`2`不在之间`1`和`3`。 答案是`NO`。 

一个常见的错误是仅检查排列顺序中的相邻值或长度为三的级数。 算术级数是根据值本身定义的，而不是在相邻位置上定义的。 

## 方法

 蛮力的想法很简单。 对于每个可能的中心值`x`，尝试每一个距离`k`这样`x-k`和`x+k`留在里面`1...n`。 使用所有值的存储位置，我们可以检查`x`位于两个端点的位置之间。 

这是正确的，因为每个有效答案都对应一个中心`x`和一个距离`k`。 问题是运行时间。 有`Θ(n^2)`可能的配对`(x,k)`，这对于`n = 300000`。 

当我们从左到右处理排列时，关键的观察结果就会出现。 

假设我们当前正在访问 value`x`。 

每个已经看到的值都位于`x`在排列中。 每个尚未看到的值都位于`x`。 

在值轴上定义一个二进制数组：```
0 = already processed
1 = not processed yet
```当我们到达`x`，我们改变价值状态`x`从`1`到`0`。 

现在看一对对称的值：```
x-k , x+k
```如果它们的状态不同，则其中一个已被处理，而另一个尚未处理。 这意味着一个端点位于`x`另一个位于右侧`x`。 因此`x`在排列中位于它们之间，并且我们找到了有效的算术级数。 

所以对于每个处理值`x`，我们只需要知道周围的二进制序列是否`x`

```
[x-t ... x+t]
```和```
t = min(x-1, n-x)
```围绕中心对称。 

如果序列完全对称，那么每一对`(x-k, x+k)`具有平等的状态。 

如果序列不对称，则某些对具有不同的状态，这会立即给出有效的答案。 

检查范围的对称性是一个经典的滚动哈希任务。 我们在存储正向和反向哈希的线段树中维护二进制数组。 更新一个位置后，我们查询周围最大的对称区间`x`并测试其正向哈希值是否等于其反向哈希值。 

第一个非回文区间证明答案是`YES`。 如果每个间隔都是回文，答案是`NO`。 这是预期的`O(n log n)`解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(n) | 太慢了|
 | 最优（线段树+哈希）| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 创建一个基于值的二进制数组`1...n`。 

最初每个条目都是`1`，这意味着该值尚未出现在排列中。 
2. 在此数组上构建线段树。 

每个节点存储其段的长度、前向滚动哈希值和反向滚动哈希值。 
3. 从左到右处理排列。 

当值`x`被访问，更新位置`x`在线段树中`1`到`0`。 
4.让$$t=\min(x-1,n-x).$$这是双方的最大距离`x-t`和`x+t`存在。 
5.查询间隔$$[x-t,\;x+t].$$获取其正向哈希和反向哈希。 
6. 如果哈希值不同，则该区间不是回文。 

那么存在一定的距离`k`使得以下各州`x-k`和`x+k`是不同的。 
7. 不同的状态意味着一个端点已被处理而另一个端点尚未处理。 

一个端点位于`x`在排列中，另一个在右侧。 
8. 价值`x`位于两个端点之间，因此存在有效对。 

打印`"YES"`并停止。 
9. 如果处理完所有值都没有找到这样的区间，则打印`"NO"`。 

### 为什么它有效

 目前价值`x`已处理，每个值都被标记`0`出现在之前`x`在排列中，每个值都标记为`1`出现在之后`x`。 

对于任何距离`k`，这对`(x-k, x+k)`当它们的状态不同时，准确地贡献有效的算术级数。 一个端点位于之前`x`和另一个之后`x`, 放置`x`他们之间。 

周围对称区间`x`是回文当且仅当每个对称对具有相等的状态。 非回文区间等价于存在一对不同状态的对，等价于存在以`x`。 

该算法会检查每个可能的中心值的这一条件，因此只要存在一个答案，它就会找到答案，并且永远不会报告误报。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MASK = (1 << 64) - 1
BASE = 911382323

def solve():
    n = int(input())
    p = list(map(int, input().split()))

    powb = [1] * (n + 1)
    for i in range(1, n + 1):
        powb[i] = (powb[i - 1] * BASE) & MASK

    size = 1
    while size < n:
        size <<= 1

    seg_len = [0] * (2 * size)
    seg_f = [0] * (2 * size)
    seg_r = [0] * (2 * size)

    for i in range(size):
        idx = size + i
        seg_len[idx] = 1
        if i < n:
            seg_f[idx] = 1
            seg_r[idx] = 1

    for v in range(size - 1, 0, -1):
        l = v * 2
        r = l + 1

        len_l = seg_len[l]
        len_r = seg_len[r]

        seg_len[v] = len_l + len_r

        seg_f[v] = (
            seg_f[l] + (seg_f[r] * powb[len_l])
        ) & MASK

        seg_r[v] = (
            seg_r[r] + (seg_r[l] * powb[len_r])
        ) & MASK

    def update(pos):
        v = size + pos - 1
        seg_f[v] = 0
        seg_r[v] = 0

        v //= 2
        while v:
            l = v * 2
            r = l + 1

            len_l = seg_len[l]
            len_r = seg_len[r]

            seg_f[v] = (
                seg_f[l] + (seg_f[r] * powb[len_l])
            ) & MASK

            seg_r[v] = (
                seg_r[r] + (seg_r[l] * powb[len_r])
            ) & MASK

            v //= 2

    def combine(a, b):
        len_a, f_a, r_a = a
        len_b, f_b, r_b = b

        return (
            len_a + len_b,
            (f_a + f_b * powb[len_a]) & MASK,
            (r_b + r_a * powb[len_b]) & MASK,
        )

    def query(l, r):
        l = l + size - 1
        r = r + size - 1

        left = (0, 0, 0)
        right = (0, 0, 0)

        while l <= r:
            if l & 1:
                left = combine(left, (seg_len[l], seg_f[l], seg_r[l]))
                l += 1

            if not (r & 1):
                right = combine((seg_len[r], seg_f[r], seg_r[r]), right)
                r -= 1

            l //= 2
            r //= 2

        return combine(left, right)

    for x in p:
        update(x)

        t = min(x - 1, n - x)
        if t == 0:
            continue

        length, fh, rh = query(x - t, x + t)

        if fh != rh:
            print("YES")
            return

    print("NO")

solve()
```线段树存储两个方向上每个间隔的滚动哈希。 范围查询返回请求间隔的正向哈希和反向哈希。 相等意味着间隔是回文。 

更新操作更改单个值`1`到`0`。 这恰好对应于将值从“未见”集移动到“已处理”集。 

周围最大对称区间`x`使用是因为每个可能的对`(x-k, x+k)`必须进行检查。 该区间内任何地方的任何不匹配都会产生所需的算术级数。 

一个微妙的点是操作的顺序。 我们必须更新`x`在检查间隔之前。 在检查的那一刻，`x`本身属于已处理的一侧，这与每个不变量相匹配`0`对应于不晚于当前位置出现的值。 

使用 64 位散列可以保持实现紧凑且快速。 碰撞在理论上是可能的，但在竞争性编程的实践中可以忽略不计。 

## 工作示例

 ### 示例 1

 输入：```
4
1 3 4 2
```| 当前值x | 更新后的二进制状态（值 1..4） | 查询间隔 | 回文？ |
 | ---| ---| ---| ---|
 | 1 | 0 1 1 1 | 0 1 1 1 无 | - |
 | 3 | 0 1 0 1 | 0 1 0 1 [2,4] = 1 0 1 | 是的 |
 | 4 | 0 1 0 0 | 0 1 0 0 无 | - |
 | 2 | 0 0 0 0 | 0 0 0 0 [1,3] = 0 0 0 | 是的 |

 没有查询的区间是非回文的，因此没有中心值在相对侧有端点。 答案是`NO`。 

### 示例 2

 输入：```
5
1 5 2 4 3
```| 当前值x | 更新后的二进制状态（值 1..5） | 查询间隔 | 回文？ |
 | ---| ---| ---| ---|
 | 1 | 0 1 1 1 1 | 0 1 1 1 1 无 | - |
 | 5 | 0 1 1 1 0 | 0 1 1 1 0 无 | - |
 | 2 | 0 0 1 1 0 | 0 0 1 1 0 [1,3] = 0 0 1 | 没有 |

 为了`x = 2`，对称对`(1,3)`有状态`(0,1)`。 价值`1`左边的是`2`在排列和值中`3`是对的`2`。 因此`2`位于它们之间，答案是`YES`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 每个排列元素一次更新和一次范围查询 |
 | 空间| O(n) | 线段树和幂数组|

 和`n = 300000`， 一个`O(n log n)`算法仅执行几百万次线段树操作，这很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    MASK = (1 << 64) - 1
    BASE = 911382323

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n = int(input())
    p = list(map(int, input().split()))

    powb = [1] * (n + 1)
    for i in range(1, n + 1):
        powb[i] = (powb[i - 1] * BASE) & MASK

    size = 1
    while size < n:
        size <<= 1

    seg_len = [0] * (2 * size)
    seg_f = [0] * (2 * size)
    seg_r = [0] * (2 * size)

    for i in range(size):
        idx = size + i
        seg_len[idx] = 1
        if i < n:
            seg_f[idx] = 1
            seg_r[idx] = 1

    for v in range(size - 1, 0, -1):
        l = v * 2
        r = l + 1
        seg_len[v] = seg_len[l] + seg_len[r]
        seg_f[v] = (seg_f[l] + seg_f[r] * powb[seg_len[l]]) & MASK
        seg_r[v] = (seg_r[r] + seg_r[l] * powb[seg_len[r]]) & MASK

    def update(pos):
        v = size + pos - 1
        seg_f[v] = seg_r[v] = 0
        v //= 2
        while v:
            l = v * 2
            r = l + 1
            seg_f[v] = (seg_f[l] + seg_f[r] * powb[seg_len[l]]) & MASK
            seg_r[v] = (seg_r[r] + seg_r[l] * powb[seg_len[r]]) & MASK
            v //= 2

    def combine(a, b):
        la, fa, ra = a
        lb, fb, rb = b
        return (
            la + lb,
            (fa + fb * powb[la]) & MASK,
            (rb + ra * powb[lb]) & MASK,
        )

    def query(l, r):
        l = l + size - 1
        r = r + size - 1
        left = (0, 0, 0)
        right = (0, 0, 0)

        while l <= r:
            if l & 1:
                left = combine(left, (seg_len[l], seg_f[l], seg_r[l]))
                l += 1
            if not (r & 1):
                right = combine((seg_len[r], seg_f[r], seg_r[r]), right)
                r -= 1
            l //= 2
            r //= 2

        return combine(left, right)

    for x in p:
        update(x)
        t = min(x - 1, n - x)
        if t:
            _, fh, rh = query(x - t, x + t)
            if fh != rh:
                return "YES"

    return "NO"

# provided samples
assert run("4\n1 3 4 2\n") == "NO", "sample 1"
assert run("5\n1 5 2 4 3\n") == "YES", "sample 2"

# custom cases
assert run("1\n1\n") == "NO", "minimum size"
assert run("3\n1 2 3\n") == "YES", "simple progression"
assert run("3\n1 3 2\n") == "NO", "small negative case"
assert run("5\n5 4 3 2 1\n") == "YES", "reversed permutation"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1`|`NO`| 最小尺寸|
 |`3 / 1 2 3`|`YES`| 最小的正例|
 |`3 / 1 3 2`|`NO`| 最小的反面例子|
 |`5 / 5 4 3 2 1`|`YES`| 尽管顺序相反，但端点位于相反侧 |

 ## 边缘情况

 考虑尽可能最小的输入：```
1
1
```不存在一对不同的值。 该算法执行一次更新，发现`t = 0`，从不查询范围，并正确打印`NO`。 

考虑```
3
1 3 2
```值中唯一的算术级数是`(1,2,3)`。 加工后`2`， 两个都`1`和`3`已经被看见了，所以它们的状态是平等的。 间隔`[1,3]`是回文，算法输出`NO`。 

考虑```
3
1 2 3
```什么时候`2`已处理，值`1`有状态`0`和价值`3`有状态`1`。 间隔`[1,3]`变为非回文。 算法立即报告`YES`，符合以下事实：`2`位于之间`1`和`3`。 

最后考虑边界附近的一个中心，比如 value`1`或值`n`。 然后`t = 0`，因此不存在有效的对称对。 该算法完全跳过查询，避免差一错误并正确处理值范围的边缘。
