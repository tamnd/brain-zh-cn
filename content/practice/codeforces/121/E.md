---
title: "CF 121E - 幸运阵列"
description: "我们有一个数组，其值始终最多为 10000。必须在线处理两个操作。 第一个操作将值 d 添加到段 [l, r] 内的每个元素。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 121
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 91 (Div. 1 Only)"
rating: 2400
weight: 121
solve_time_s: 141
verified: true
draft: false
---

[CF 121E - 幸运阵列](https://codeforces.com/problemset/problem/121/E)

 **评分：** 2400
 **标签：** 数据结构
 **求解时间：** 2m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个数组，其值始终最多`10000`。 Two operations must be processed online.

 第一个操作增加了一个值`d`到段内的每个元素`[l, r]`。 

第二个操作询问里面有多少个数字`[l, r]`很幸运，幸运数字仅由数字组成`4`和`7`。 

困难在于不认识幸运数字。 下面的人很少`10000`。 真正的挑战是支持最多`10^5`范围添加和`10^5`范围查询足够快。 

直接模拟立即就会遇到麻烦。 假设每个操作几乎更新整个数组。 逐一重新计算受影响的值`O(n)`每次更新。 和`10^5`运营和`10^5`元素，这大致变成`10^10`更新，远远超出了极限。 

每个值始终最多保持的界限`10000`是关键的结构特性。 只有`2 + 4 + 8 + 16 = 30`这个范围内的幸运数字。 我们可以跟踪每个值距离幸运还有多远，而不是花费昂贵的成本来跟踪精确值。 

一些边缘情况会导致简单的优化失败。 

考虑这个输入：```
3 2
3 4 5
add 1 3 1
count 1 3
```添加后数组变为`[4,5,6]`，所以答案是`1`。 任何只更新先前幸运位置的实现都会错过这一点`3`变得幸运。 

另一个微妙的情况：```
3 3
4 7 44
add 1 3 1
add 1 3 1
count 1 3
```数组演化为`[5,8,45]`然后`[6,9,46]`。 正确答案是`0`。 仅存储位置当前是否幸运而不重新计算转换的惰性结构将错误地保留陈旧的幸运计数。 

当一个段接收到许多惰性添加时，就会出现第三种重要情况：```
5 3
1 2 3 4 5
add 1 5 100
add 1 5 200
count 1 5
```最终的数组是`[301,302,303,304,305]`，并且仅`304`是幸运吗？ 不，不是，因为幸运数字只包含数字`4`和`7`。 正确答案是`0`。 这会捕获意外解释“包含 4 或 7”而不是“所有数字都是 4 或 7”的实现。 

## 方法

 暴力解决方案很简单。 对于每一个`add`操作，迭代整个区间并更新每个元素。 对于每一个`count`操作，再次迭代并单独测试每个数字。 

检查一个数字是否幸运最多需要四位数字检查，因为值永远不会超过`10000`。 因此，昂贵的部分是重复扫描间隔。 

在最坏的情况下，每个操作都会触及整个数组。 这给出了`10^5 × 10^5 = 10^10`元素更新或检查。 即使在 C++ 中，在 4 秒的限制下也是没有希望的。 

关键的观察结果是幸运数字的集合很小。 最多只有30个幸运数字`10000`。 

对于一个值`x`，重要的不是确切的数字本身，而是到下一个幸运数字的距离。 假设下一个幸运数字等于或以上`x`是`L`。 定义：```
delta = L - x
```如果`delta == 0`，目前这个数字是幸运的。 

Now consider adding`d`到整个段。 该值变为`x + d`，所以新的距离变为：```
L - (x + d) = delta - d
```范围加法只是减去`d`来自所有三角洲。 

这将问题转化为线段树可以非常自然地处理的问题。 

对于每个线段树节点，我们维护：```
mn = minimum delta in this segment
cnt = how many positions have delta == 0
```当我们应用惰性加法时，所有增量都会均匀移动，因此`mn`也均匀地移动。 

关键的技巧是这样的：

 如果减去之后`d`，该节点仍有`mn > 0`，那么该段中没有元素变得幸运。 我们可以立即停下来，不再继续下降。 

只有当某些增量变为非正值时，我们才会进一步推进。 由于每个元素总共只能跨越幸运阈值约 30 次，因此昂贵的下降总数仍然是可控的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(nm)`|`O(n)`| 太慢了 |
 | 最佳 |`O((n + m) log n log C)`摊销|`O(n)`| 已接受 |

 这里`C`是最大值范围，大约`10000`。 

## 算法演练

 1. 预先计算所有幸运数字`10000`。 

数字上的 DFS 或 BFS`4`和`7`仅生成 30 个数字，因此这一步很简单。 
2. 对于每个初始数组值`a[i]`,计算下一个幸运数字`L >= a[i]`。 

店铺：```
delta[i] = L - a[i]
```如果`delta[i] == 0`， 然后`a[i]`已经是幸运的了。 
3. 构建线段树。 

每个节点存储：```
mn  = minimum delta in the segment
cnt = number of zeros in the segment
lazy = pending subtraction applied to all deltas
```一片叶子与`delta == 0`有`cnt = 1`， 否则`cnt = 0`。 
4.对于一个`count l r`查询，返回总和`cnt`超过请求间隔的值。 

当头寸的增量为零时，它就会准确贡献。 
5. 对于一个`add l r d`运算、减法`d`来自区间内的所有增量。 

从概念上讲，每个值都移动了`d`更接近下一个幸运数字。 
6.当更新被更新完全覆盖的线段树节点时，减少：```
mn -= d
lazy -= d
```如果之后`mn > 0`，那么每个 delta 仍然为正，因此没有元素变得幸运。 该节点仍然有效。 
7.如果`mn <= 0`，至少有一个元素跨越了幸运边界。 

我们必须递归下降来重新计算受影响的叶子。 
8. 在一片叶子上，当`delta <= 0`，当前值已达到或超过其跟踪的幸运数字。 

我们更新实际的数组值，重新计算下一个幸运数字，并重建叶子状态。 
9. 递归更新后，向上合并子项：```
mn = min(left.mn, right.mn)
cnt = left.cnt + right.cnt
```### 为什么它有效

 每个叶子总是存储从其当前值到下一个大于或等于它的幸运数的距离。 

范围添加会均匀地减少这些距离。 如果所有距离都保持正值，则没有值变得幸运并且不需要重新计算。 

每当距离变为非正数时，该位置就跨越了幸运阈值。 重新计算下一个幸运数字可以恢复不变量。 

因为每个值一次最多只能跨越一个幸运数字，而下面的幸运数字只有30个`10000`，每个元素在整个执行过程中仅重建少量次。 线段树始终为每个间隔维护正确的幸运计数。 

## Python 解决方案```python
import sys
from bisect import bisect_left

input = sys.stdin.readline

def generate_lucky():
    res = []

    def dfs(x):
        if x > 10000:
            return
        if x:
            res.append(x)
        dfs(x * 10 + 4)
        dfs(x * 10 + 7)

    dfs(0)
    res.sort()
    return res

LUCKY = generate_lucky()

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.arr = arr[:]

        size = 4 * self.n + 5
        self.mn = [0] * size
        self.cnt = [0] * size
        self.lazy = [0] * size

        self.build(1, 0, self.n - 1)

    def next_delta(self, x):
        idx = bisect_left(LUCKY, x)
        return LUCKY[idx] - x

    def apply(self, node, val):
        self.mn[node] += val
        self.lazy[node] += val

    def push(self, node):
        if self.lazy[node]:
            v = self.lazy[node]
            self.apply(node * 2, v)
            self.apply(node * 2 + 1, v)
            self.lazy[node] = 0

    def pull(self, node):
        self.mn[node] = min(self.mn[node * 2], self.mn[node * 2 + 1])
        self.cnt[node] = self.cnt[node * 2] + self.cnt[node * 2 + 1]

    def build(self, node, l, r):
        if l == r:
            d = self.next_delta(self.arr[l])
            self.mn[node] = d
            self.cnt[node] = 1 if d == 0 else 0
            return

        mid = (l + r) // 2

        self.build(node * 2, l, mid)
        self.build(node * 2 + 1, mid + 1, r)

        self.pull(node)

    def rebuild_leaf(self, node, idx):
        d = self.next_delta(self.arr[idx])
        self.mn[node] = d
        self.cnt[node] = 1 if d == 0 else 0

    def range_add(self, node, l, r, ql, qr, val):
        if ql <= l and r <= qr:
            self.apply(node, -val)

            if self.mn[node] > 0:
                return

        if l == r:
            self.arr[l] += val
            self.rebuild_leaf(node, l)
            return

        self.push(node)

        mid = (l + r) // 2

        if ql <= mid:
            self.range_add(node * 2, l, mid, ql, qr, val)

        if qr > mid:
            self.range_add(node * 2 + 1, mid + 1, r, ql, qr, val)

        self.pull(node)

    def query(self, node, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.cnt[node]

        self.push(node)

        mid = (l + r) // 2
        ans = 0

        if ql <= mid:
            ans += self.query(node * 2, l, mid, ql, qr)

        if qr > mid:
            ans += self.query(node * 2 + 1, mid + 1, r, ql, qr)

        return ans

def solve():
    n, m = map(int, input().split())
    arr = list(map(int, input().split()))

    seg = SegTree(arr)

    out = []

    for _ in range(m):
        parts = input().split()

        if parts[0] == "add":
            l = int(parts[1]) - 1
            r = int(parts[2]) - 1
            d = int(parts[3])

            seg.range_add(1, 0, n - 1, l, r, d)

        else:
            l = int(parts[1]) - 1
            r = int(parts[2]) - 1

            out.append(str(seg.query(1, 0, n - 1, l, r)))

    sys.stdout.write("\n".join(out))

solve()
```第一部分生成所有幸运数字，直到`10000`。 由于计数很小，因此递归生成比单独检查每个整数更简单、更干净。 

线段树从不存储实际值，除了叶子到`self.arr`。 内部节点仅跟踪到幸运数字的最小距离以及当前幸运位置的数量。 

最微妙的细节是更新期间的符号约定。 

如果一个值增加`d`，那么它到下一个幸运数字的距离减少`d`。 这就是更新适用的原因`-d`到`mn`和`lazy`。 

另一个容易犯的错误是过早停止递归。 我们只能在以下情况下停止：`mn > 0`。 如果`mn == 0`，某些元素恰好是幸运的，并且节点必须准确地保存该信息。 

在叶子处，我们使用实际更新值进行重建。 我们不能简单地永远减去增量，因为一旦一个值超过了其跟踪的幸运数字，“下一个幸运数字”就会发生变化。 

即使对于稍后递归的节点，该实现也会存储挂起的惰性值。 这保证了子级在进一步操作之前始终收到正确的累积更新。 

## 工作示例

 ### 示例 1

 输入：```
3 6
2 3 4
count 1 3
count 1 2
add 1 3 2
count 1 3
add 2 3 3
count 1 3
```初始增量：

 | 职位| 价值| 下一个幸运 | 达美航空 |
 | ---| ---| ---| ---|
 | 1 | 2 | 4 | 2 |
 | 2 | 3 | 4 | 1 |
 | 3 | 4 | 4 | 0 |

 第一个查询：

 | 查询 | 幸运职位| 回答 |
 | ---| ---| ---|
 | 数 1 3 | {3} | 1 |

 第二次查询：

 | 查询 | 幸运职位| 回答 |
 | ---| ---| ---|
 | 数 1 2 | {} | 0 |

 后`add 1 3 2`:

 | 职位| 旧值| 新价值 | 新达美|
 | ---| ---| ---| ---|
 | 1 | 2 | 4 | 0 |
 | 2 | 3 | 5 | 2 |
 | 3 | 4 | 6 | 1 |

 第三次查询：

 | 查询 | 幸运职位| 回答 |
 | ---| ---| ---|
 | 数 1 3 | {1} | 1 |

 后`add 2 3 3`:

 | 职位| 旧值| 新价值 | 新达美|
 | ---| ---| ---| ---|
 | 1 | 4 | 4 | 0 |
 | 2 | 5 | 8 | 36 | 36
 | 3 | 6 | 9 | 35 | 35

 最终查询：

 | 查询 | 幸运职位| 回答 |
 | ---| ---| ---|
 | 数 1 3 | {1} | 1 |

 该痕迹显示了为什么在跨越幸运阈值后必须重建叶子。 位置 2 不再定位幸运数字`7`瞄准`44`。 

### 示例 2

 输入：```
4 3
4 44 5 6
count 1 4
add 3 4 1
count 1 4
```初始状态：

 | 职位| 价值| 幸运 |
 | ---| ---| ---|
 | 1 | 4 | 是的 |
 | 2 | 44 | 44 是的 |
 | 3 | 5 | 没有 |
 | 4 | 6 | 没有 |

 第一个查询：

 | 查询 | 回答 |
 | ---| ---|
 | 数 1 4 | 2 |

 更新后：

 | 职位| 旧值| 新价值 | 幸运 |
 | ---| ---| ---| ---|
 | 3 | 5 | 6 | 没有 |
 | 4 | 6 | 7 | 是的 |

 第二次查询：

 | 查询 | 回答 |
 | ---| ---|
 | 数 1 4 | 3 |

 这个例子表明，当一个非幸运值的 delta 达到零时，它就会变得幸运。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O((n + m) log n log C)`摊销| 每次重建都会沿着树下降，并且每个元素仅跨越少数幸运阈值 |
 | 空间|`O(n)`| 线段树数组和存储值 |

 以下只有30个幸运数字`10000`，因此每个位置只能触发昂贵的重建逻辑有限次数。 摊余复杂度很容易符合以下限制`10^5`运营。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from bisect import bisect_left

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def generate_lucky():
        res = []

        def dfs(x):
            if x > 10000:
                return
            if x:
                res.append(x)
            dfs(x * 10 + 4)
            dfs(x * 10 + 7)

        dfs(0)
        res.sort()
        return res

    LUCKY = generate_lucky()

    class SegTree:
        def __init__(self, arr):
            self.n = len(arr)
            self.arr = arr[:]

            size = 4 * self.n + 5
            self.mn = [0] * size
            self.cnt = [0] * size
            self.lazy = [0] * size

            self.build(1, 0, self.n - 1)

        def next_delta(self, x):
            idx = bisect_left(LUCKY, x)
            return LUCKY[idx] - x

        def apply(self, node, val):
            self.mn[node] += val
            self.lazy[node] += val

        def push(self, node):
            if self.lazy[node]:
                v = self.lazy[node]
                self.apply(node * 2, v)
                self.apply(node * 2 + 1, v)
                self.lazy[node] = 0

        def pull(self, node):
            self.mn[node] = min(self.mn[node * 2], self.mn[node * 2 + 1])
            self.cnt[node] = self.cnt[node * 2] + self.cnt[node * 2 + 1]

        def build(self, node, l, r):
            if l == r:
                d = self.next_delta(self.arr[l])
                self.mn[node] = d
                self.cnt[node] = 1 if d == 0 else 0
                return

            mid = (l + r) // 2

            self.build(node * 2, l, mid)
            self.build(node * 2 + 1, mid + 1, r)

            self.pull(node)

        def rebuild_leaf(self, node, idx):
            d = self.next_delta(self.arr[idx])
            self.mn[node] = d
            self.cnt[node] = 1 if d == 0 else 0

        def range_add(self, node, l, r, ql, qr, val):
            if ql <= l and r <= qr:
                self.apply(node, -val)

                if self.mn[node] > 0:
                    return

            if l == r:
                self.arr[l] += val
                self.rebuild_leaf(node, l)
                return

            self.push(node)

            mid = (l + r) // 2

            if ql <= mid:
                self.range_add(node * 2, l, mid, ql, qr, val)

            if qr > mid:
                self.range_add(node * 2 + 1, mid + 1, r, ql, qr, val)

            self.pull(node)

        def query(self, node, l, r, ql, qr):
            if ql <= l and r <= qr:
                return self.cnt[node]

            self.push(node)

            mid = (l + r) // 2
            ans = 0

            if ql <= mid:
                ans += self.query(node * 2, l, mid, ql, qr)

            if qr > mid:
                ans += self.query(node * 2 + 1, mid + 1, r, ql, qr)

            return ans

    n, m = map(int, input().split())
    arr = list(map(int, input().split()))

    seg = SegTree(arr)

    out = []

    for _ in range(m):
        parts = input().split()

        if parts[0] == "add":
            l = int(parts[1]) - 1
            r = int(parts[2]) - 1
            d = int(parts[3])

            seg.range_add(1, 0, n - 1, l, r, d)

        else:
            l = int(parts[1]) - 1
            r = int(parts[2]) - 1

            out.append(str(seg.query(1, 0, n - 1, l, r)))

    return "\n".join(out)

# provided sample
assert run(
"""3 6
2 3 4
count 1 3
count 1 2
add 1 3 2
count 1 3
add 2 3 3
count 1 3
"""
) == "1\n0\n1\n1"

# minimum size
assert run(
"""1 2
4
count 1 1
count 1 1
"""
) == "1\n1"

# becoming lucky after update
assert run(
"""2 2
3 6
add 1 2 1
count 1 2
"""
) == "2"

# all equal values
assert run(
"""5 3
7 7 7 7 7
count 1 5
add 2 4 1
count 1 5
"""
) == "5\n2"

# boundary interval update
assert run(
"""5 4
1 2 3 4 5
add 1 5 3
count 1 5
add 5 5 2
count 4 5
"""
) == "2\n1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单元素已然幸运 |`1 1`| 最小尺寸处理 |
 | 价值观变得幸运|`2`| 跨越幸运门槛|
 | 一切值最初幸运|`5 2`| 更新后正确减量 |
 | 全系列及后缀更新|`2 1`| Boundary correctness and indexing |

 ## 边缘情况

 考虑一下值在更新后恰好变得幸运的情况。 

输入：```
1 2
3
add 1 1 1
count 1 1
```最初下一个幸运数字是`4`， 所以`delta = 1`。 添加后`1`，段更新减去`1`来自三角洲，生产`0`。 自从`mn <= 0`，算法下降到叶子并重建它。 该值变为`4`，这是幸运的，所以`cnt = 1`。 查询正确返回`1`。 

现在考虑留下一个幸运数字。 

输入：```
1 2
4
add 1 1 1
count 1 1
```最初`delta = 0`。 添加后`1`, δ 变为`-1`，强制重建。 新值是`5`，谁的下一个幸运数字是`7`，因此重建的 delta 变为`2`和`cnt = 0`。 答案是正确的`0`。 

最后，考虑重复惰性更新而不重建大多数节点。 

输入：```
5 3
1 1 1 1 1
add 1 5 1
add 1 5 1
count 1 5
```每个值从`1`到`3`。 他们的下一个幸运数字仍然存在`4`，所以 delta 是从`3`到`2`到`1`。 由于段最小值永远不会变为非正数，因此算法永远不会不必要地下降。 最终的答案是`0`，并且更新成本保持接近对数，而不是触及每片叶子。
