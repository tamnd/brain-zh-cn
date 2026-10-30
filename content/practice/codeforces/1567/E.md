---
title: "CF 1567E - 非递减困境"
description: "我们在点更新下维护一个数组。 每次更新后，将来的查询必须使用新值。 对于对段 [l, r] 的查询，我们必须计算完全在该范围内的非递减子数组的数量。"
date: "2026-06-10T11:46:55+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "divide-and-conquer", "math"]
categories: ["algorithms"]
codeforces_contest: 1567
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 742 (Div. 2)"
rating: 2200
weight: 1567
solve_time_s: 139
verified: true
draft: false
---

[CF 1567E - 非递减困境](https://codeforces.com/problemset/problem/1567/E)

 **评分：** 2200
 **标签：** 数据结构、分而治之、数学
 **求解时间：** 2m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在点更新下维护一个数组。 每次更新后，将来的查询必须使用新值。 

对于一个段的查询`[l, r]`，我们必须计算有多少个完全在该范围内的子数组是非递减的。 一个子数组`[p, q]`如果其中的每个相邻对都满足，则有效`a[i] ≤ a[i+1]`。 

挑战在于更新和查询都很频繁。 数组大小和操作次数分别为`2 · 10^5`。 

对每个查询进行直接重新计算是不可能的。 即使扫描整个查询间隔也会花费`O(n)`每个查询，大致变成`4 · 10^10`最坏情况下的操作。 

从约束中观察到的关键是我们需要一些东西`O(log n)`每次操作。 这强烈暗示了线段树或其他对数数据结构。 

有几种微妙的情况会导致简单的合并失败。 

考虑：```
[1, 2] + [2, 3]
```两半都是非减的，边界也满足`2 ≤ 2`。 穿过中点的子数组提供了额外的有效答案。 如果我们只将答案存储在每一半中并将它们相加，我们就会错过所有交叉子数组。 

现在考虑：```
[1, 3] + [2, 4]
```每一半在内部都是不减的，但边界违反了条件，因为`3 > 2`。 没有交叉子数组是有效的。 总是合并运行的合并会计数过多。 

另一个常见错误出现在相同的值上：```
1 1 1
```每个子数组都是非减的，所以答案是：```
3 + 2 + 1 = 6
```使用严格的不平等代替非严格的不平等会产生较小的答案。 

最后，单个元素范围始终恰好贡献一个有效子数组。 任何线段树状态都必须正确处理长度为 1 的线段。 

## 方法

 蛮力方法很简单。 对于每个查询`[l, r]`，枚举该范围内的所有子数组并检查每个子数组是否是非递减的。 

有`O((r-l+1)^2)`候选子数组。 检查每一项直接给出`O(n^3)`最坏情况下的时间。 即使我们预先计算信息并减少验证`O(1)`，我们还需要`O(n^2)`每个查询的工作量。 和`2 · 10^5`这样的操作是完全不可行的。 

暴力解决方案在概念上起作用的原因是每个有效答案只是非递减子数组的计数。 困难在于有效地计算那些跨越段边界的数据。 

思考该问题的一个有用方法是，每个最大非递减长度游程`k`贡献$$\frac{k(k+1)}2$$有效的子数组。 

例如：```
1 2 3 1 5
```包含长度游程`3`和`2`, 贡献```
6 + 3 = 9
```子数组。 

线段树解决方案存储有关每个线段的足够信息，以重建两个相邻线段连接时运行的行为方式。 

假设我们知道：

 1. 每个孩子内心的总答案。 
2. 每个孩子的最长非递减前缀。 
3. 每个孩子的最长非递减后缀。 
4. 最左边和最右边的值。 

然后在合并两个段时我们可以判断边界是否满足```
right_value_left ≤ left_value_right
```如果是这样，则来自左子级的后缀运行和来自右子级的前缀运行将连接到一个更大的运行中。 每个交叉非减子数组都是通过在左后缀中选择起点和在右前缀中选择终点来形成的。 

如果后缀长度为`s`前缀长度为`p`，交叉子数组的数量恰好是```
s · p
```这给出了一个干净的线段树合并`O(1)`时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个查询从 O(n²) 到 O(n³) | O(1) | O(1) | 太慢了 |
 | 最优线段树| 每次操作 O(log n) | O(n) | 已接受 |

 ## 算法演练

 ### 段信息

 对于代表区间的每个线段树节点，存储：`len`= 间隔长度。`lv`= 最左边的值。`rv`= 最右边的值。`pref`= 最长非递减前缀的长度。`suff`= 最长非递减后缀的长度。`ans`= 完全在区间内的非递减子数组的数量。 

### 合并规则

 假设我们合并左孩子`A`和右孩子`B`。 

#### 1.计算基本字段

 合并后的长度为：```
len = A.len + B.len
```最左边的值来自`A`，最右边的值来自`B`。 

#### 2. 从内部答案开始

 完全位于任一子数组内的所有有效子数组都已做出贡献：```
ans = A.ans + B.ans
```#### 3. 检查运行是否穿过中点连接

 如果```
A.rv <= B.lv
```那么非减后缀`A`连接非递减前缀`B`。 

每个交叉有效子数组通过选择获得：```
start in A's suffix
end in B's prefix
```所以我们添加```
A.suff * B.pref
```到答案。 

#### 4. 计算合并前缀

 前缀最初等于`A.pref`。 

如果整个左段是一个非递减前缀并且边界相连，则该前缀延伸到右子节点：```
pref = A.len + B.pref
```#### 5. 计算合并后缀

 对称地，如果整个右线段是一个非递减后缀并且边界相连：```
suff = B.len + A.suff
```否则它仍然存在`B.suff`。 

#### 6. 构建线段树

 每片叶子对应一个数组元素。 

对于一片叶子：```
len = 1
pref = 1
suff = 1
ans = 1
lv = rv = value
```#### 7. 处理更新

 修改一个叶子并使用合并规则重新计算到根的路径上的所有节点。 

#### 8. 处理查询

 执行标准线段树范围查询。 

查询返回描述的聚合节点`[l, r]`。 

它是`ans`字段正是所需的答案。 

### 为什么它有效

 段内的每个非递减子数组都属于三个类别之一。 

它完全位于左孩子中，完全位于右孩子中，或者穿过中点。 

前两类已计算在内`A.ans`和`B.ans`。 

当在左孩子的最大非递减后缀内选择左端点并且在右孩子的最大非递减前缀内选择右端点时，恰好存在交叉子数组。 如果中点值违反非递减条件，则不能存在交叉子数组。 

合并对每个交叉子数组精确计数一次`A.suff × B.pref`，并且从不计算无效的。 由于每个线段树节点都是使用此不变量构建的，因此任何查询区间的根都存储非递减子数组的确切数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Node:
    __slots__ = ("length", "lv", "rv", "pref", "suff", "ans")

    def __init__(self, length=0, lv=0, rv=0, pref=0, suff=0, ans=0):
        self.length = length
        self.lv = lv
        self.rv = rv
        self.pref = pref
        self.suff = suff
        self.ans = ans

def merge(a, b):
    if a.length == 0:
        return b
    if b.length == 0:
        return a

    res = Node()
    res.length = a.length + b.length
    res.lv = a.lv
    res.rv = b.rv

    res.ans = a.ans + b.ans

    connected = a.rv <= b.lv

    if connected:
        res.ans += a.suff * b.pref

    res.pref = a.pref
    if connected and a.pref == a.length:
        res.pref = a.length + b.pref

    res.suff = b.suff
    if connected and b.suff == b.length:
        res.suff = b.length + a.suff

    return res

n, q = map(int, input().split())
a = list(map(int, input().split()))

size = 1
while size < n:
    size <<= 1

seg = [Node() for _ in range(2 * size)]

for i in range(n):
    seg[size + i] = Node(
        length=1,
        lv=a[i],
        rv=a[i],
        pref=1,
        suff=1,
        ans=1,
    )

for i in range(size - 1, 0, -1):
    seg[i] = merge(seg[i * 2], seg[i * 2 + 1])

for _ in range(q):
    t, x, y = map(int, input().split())

    if t == 1:
        pos = x - 1

        p = size + pos
        seg[p] = Node(
            length=1,
            lv=y,
            rv=y,
            pref=1,
            suff=1,
            ans=1,
        )

        p //= 2
        while p:
            seg[p] = merge(seg[p * 2], seg[p * 2 + 1])
            p //= 2

    else:
        l = x - 1
        r = y - 1

        left_res = Node()
        right_res = Node()

        l += size
        r += size + 1

        while l < r:
            if l & 1:
                left_res = merge(left_res, seg[l])
                l += 1

            if r & 1:
                r -= 1
                right_res = merge(seg[r], right_res)

            l //= 2
            r //= 2

        res = merge(left_res, right_res)
        print(res.ans)
```该节点准确地存储了合并操作所需的信息。 不需要额外的数据。 

最微妙的部分是范围查询。 线段树查询分别从左右方向收集片段。 顺序很重要，因为合并不可交换。 一段`[A][B]`必须以不同方式合并`[B][A]`。 

这就是为什么实施保持`left_res`和`right_res`独立并仅在最后将它们组合起来。 

另一个微妙的细节是中性节点。 一个节点与`length = 0`充当单位元。 只要一侧为空，合并函数就会立即返回另一个操作数。 

所有答案值都适合 64 位整数，因为长度中子数组的最大数量`2 · 10^5`间隔约为`2 · 10^10`。 

## 工作示例

 ### 示例 1

 数组：```
3 1 4 1 5
```询问：```
2 2 5
```间隔为：```
1 4 1 5
```| 运行| 长度| 贡献|
 | --- | --- | --- |
 | 1 4 | 2 | 3 |
 | 1 5 | 1 2 | 3 |

 总答案：```
3 + 3 = 6
```| 细分 | 首选项 | 够了| 回答 |
 | --- | --- | --- | --- |
 | [1,4]| 2 | 2 | 3 |
 | [1,5]| 2 | 2 | 3 |
 | 合并| 2 | 2 | 6 |

 此示例显示中间边界处的连接失败。 答案就是两次独立运行的总和。 

### 示例 2

 数组：```
1 2 3 4
```询问：```
2 1 4
```| 细分 | 前缀 | 够了| 和 |
 | --- | --- | --- | --- |
 | [1,2]| 2 | 2 | 3 |
 | [3,4]| 2 | 2 | 3 |
 | 穿越| 2 | 2 | 4 |
 | 总计 | 4 | 4 | 10 | 10
 交叉贡献为：```
2 × 2 = 4
```给予```
3 + 3 + 4 = 10
```它等于完全非递减数组的所有子数组的数量：$$\frac{4 \cdot 5}{2}=10$$此跟踪演示了左子节点的后缀和右子节点的前缀如何组合。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每次操作 O(log n) | 更新和查询仅涉及对数数量的节点 |
 | 空间| O(n) | 线段树存储 O(n) 个节点 |

 和`n, q ≤ 2 · 10^5`，总工作量大约为`q log n`，大约有几百万次操作。 这很容易满足时间限制，并且线段树很容易满足内存限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    from subprocess import run as sp_run, PIPE
    return "implement locally"

# sample 1
# expected:
# 6
# 4
# 10
# 7

# minimum size
# n = 1
# answer always 1

# all equal
# 5 elements => 15 subarrays

# strictly decreasing
# only singleton subarrays count

# boundary merge test
# [1,2] and [2,3] must connect
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素数组 | 1 | 树叶处理|
 | 所有值均相等 | n(n+1)/2 | n(n+1)/2 | 非严格不平等|
 | 严格递减数组 | 元素数量 | 禁止交叉合并 |
 | 边界值相等 | 正确的合并游程长度 |`<=`而不是`<`|

 ## 边缘情况

 考虑：```
3
1 1 1
```每个相邻比较都会成功。 整个段成为一串长度`3`，贡献：$$\frac{3\cdot4}{2}=6$$合并条件使用`<=`，因此两个边界正确连接并且线段树返回`6`。 

现在考虑：```
3
3 2 1
```没有边界满足非递减条件。 每次合并都会贡献零交叉子数组。 唯一有效的子数组是三个单例区间，所以答案是`3`。 

第三个重要案例是：```
1 2 2 3
```中间的等式仍然必须连接运行。 合并期间，边界检查成功，因为`2 ≤ 2`。 该段成为长度不减的一串`4`，产生答案`10`。 

最后，对于包含一个位置的查询：```
2 5 5
```范围查询返回单个叶节点。 它存储的答案是`1`，这正是单元素区间内子数组的数量。
