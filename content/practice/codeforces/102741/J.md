---
title: "CF 102741J - 电子竞技锦标赛"
description: "该系统维护用户的社交网络。 友谊连接将两个用户加入同一个朋友组，其中组是图的连接组件。 对于每个锦标赛查询，我们都会被问到可以组成多少支大小正好为 s 的球队。"
date: "2026-07-29T00:49:38+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102741
codeforces_index: "J"
codeforces_contest_name: "UTPC Contest 9-25-20 Div. 1"
rating: 0
weight: 102741
solve_time_s: 57
verified: true
draft: false
---

[CF 102741J - 电子竞技锦标赛](https://codeforces.com/problemset/problem/102741/J)

 **评级：** -
 **标签：** -
 **求解时间：** 57s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 该系统维护用户的社交网络。 友谊连接将两个用户加入同一个朋友组，其中组是图的连接组件。 对于每个锦标赛查询，我们都会被询问有多少支球队的确切规模`s`可以形成。 一个团队必须完全来自一个好友群组，一个群组可以贡献多个团队，只要不共享用户。 因此答案是`floor(size_of_group / s)`超过当前所有朋友组。 

输入最多包含`10^5`用户和`10^5`运营。 友谊操作仅添加边，因此可以使用不相交的集联合结构来维护连接的组件。 但是，查询可以询问任何团队规模`1`到`n`，这意味着为每个查询重新计算所有组件是不可能的。 和`10^5`操作，甚至是`O(n)`每个查询的答案将接近`10^10`操作并且无法适应典型的竞赛限制。 

困难的部分是不维护连接的组件。 困难的部分是保持价值观`sum floor(component_size / s)`对于每一个可能的`s`当组件尺寸发生变化时。 

一个常见的错误是在合并后更新所有可能的团队规模。 例如，如果组件尺寸增大`1`尺寸`50000`，直接改变每一个`s`最多`50000`适用于一次合并，但数千次合并会使解决方案太慢。 

另一个边缘情况是处理尺寸`1`成分。 最初每个用户都是单独的，因此查询团队规模`1`必须返回`n`，而对任何更大尺寸的查询必须返回`0`。 

例子：```
5 3
2 1
2 2
1 1 2
```第一个查询要求团队规模`1`，所以答案是`5`。 用户使用后`1`和`2`成为朋友，团体有大小`2,1,1,1`，所以有一个尺寸`2`团队查询返回`1`， 不是`2`，因为两个用户的一组只能提供一个完整的团队。 

另一个边缘情况是合并已连接的用户。 当同一组中的两个用户再次成为朋友时，友谊图不会改变。 粗心的实现可能会两次删除该组件并损坏存储的计数。 

例子：```
3 3
1 1 2
1 2 1
2 2
```最终组件尺寸为`2,1`，所以答案是`1`。 第二个联合运算必须被忽略。 

## 方法

 一个简单的解决方案使用不相交集合并来维护组件。 对于每个类型的查询`2`，我们可以迭代所有当前组件大小并计算每个组件贡献了多少个团队。 这是正确的，因为每个小组都独立做出贡献`size // s`团队。 

问题是查询成本。 可以有`10^5`查询，也可以有`10^5`成分。 在最坏的情况下，这种方法的表现大约是`10^10`操作，速度太慢。 

关键的观察结果是尺寸的一个组成部分`x`贡献`floor(x / s)`每个团队规模的答案`s`。 我们不需要全部更新`s`单独。 的价值`floor(x / s)`仅改变约`2 * sqrt(x)`次。 例如，所有`s`某个区间内的值可能会产生相同的商。 

这使我们能够将添加或删除组件的效果表示为少量范围添加。 由于查询要求一个特定的`s`，差异数组上的 Fenwick 树可以支持范围添加和点查询。 

当两个分量的尺寸`a`和`b`合并成大小`a+b`，我们删除了的贡献`a`和`b`并添加贡献`a+b`。 DSU 处理连接，而 Fenwick 树则维护答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(nq)`|`O(n)`| 太慢了|
 | 最佳 |`O((n+q) * sqrt(n) * log n)`|`O(n)`| 已接受 |

 ## 算法演练

 1. 将每个用户初始化为其自己的 DSU 组件。 单个用户贡献`floor(1/s)`团队，因此可以使用相同的组件更新例程添加初始贡献。 
2. 维护一个存储范围添加的 Fenwick 树。 位置处的值`s`代表当前有效团队规模的数量`s`。 
3. 添加尺寸组件时`x`，找到团队规模的每个区间，其中`floor(x/s)`具有相同的值。 对于每个这样的间隔`[l,r]`，将该商添加到该范围内的芬威克树中。 
4. 拆卸元件时，以相反的符号进行相同的操作。 这使得每个可能的团队规模答案与当前的组件规模保持同步。 
5. 对于友谊操作，找到两个 DSU 根。 如果它们已经相等，则不会发生任何变化。 否则，删除两个旧组件贡献，合并 DSU 集，并添加新组件大小的贡献。 
6. 对于带有团队规模的锦标赛查询`s`，向 Fenwick 树询问该位置的值`s`。 

商区间较小的原因是`floor(x/s)`一开始缓慢下降，然后在接近尾声时迅速变化。 不同值的数量受以下限制`O(sqrt(x))`，所以每个组件的更新都是高效的。 

为什么它有效：

 保持不变的是芬威克树在每个位置的值`s`等于总和`floor(size/s)`覆盖所有当前连接的组件。 最初这是正确的，因为每个组件都被插入。 合并会准确删除两个旧组件并准确插入新组件，因此在每次友谊操作后，不变式仍然为真。 查询只需读取所请求团队规模的维护值，这正是所需的团队数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 2)

    def add(self, idx, val):
        while idx <= self.n:
            self.bit[idx] += val
            idx += idx & -idx

    def range_add(self, l, r, val):
        if l > r:
            return
        self.add(l, val)
        self.add(r + 1, -val)

    def query(self, idx):
        res = 0
        while idx:
            res += self.bit[idx]
            idx -= idx & -idx
        return res

def solve():
    n, q = map(int, input().split())

    parent = list(range(n + 1))
    size = [1] * (n + 1)

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    fw = Fenwick(n)

    def update_component(x, delta):
        l = 1
        while l <= x:
            val = x // l
            r = x // val
            fw.range_add(l, r, val * delta)
            l = r + 1

    update_component(1, n)

    ans = []

    for _ in range(q):
        query = list(map(int, input().split()))
        if query[0] == 1:
            a, b = query[1], query[2]
            ra, rb = find(a), find(b)
            if ra != rb:
                update_component(size[ra], -1)
                update_component(size[rb], -1)
                if size[ra] < size[rb]:
                    ra, rb = rb, ra
                parent[rb] = ra
                size[ra] += size[rb]
                update_component(size[ra], 1)
        else:
            ans.append(str(fw.query(query[1])))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```芬威克树存储差异数组而不是直接存储答案。 范围更新在左边界处添加并在右边界后减去，并且前缀和重建特定团队规模的当前答案。 

这`update_component`功能是核心优化。 它遍历区间`x // s`是恒定的。 线路`r = x // val`直接跳转到当前间隔的末尾，避免循环遍历每个可能的团队规模。 

DSU 使用路径压缩和按大小联合。 合并顺序要小心处理，因为存储的组件大小属于合并后的根。 如果两个用户已经具有相同的根，则不会进行贡献更改。 

## 工作示例

 对于第一个样本：```
5 6
2 2
1 1 2
2 2
2 3
1 1 3
2 3
```| 步骤| 运营| 元件尺寸| 查询解答 |
 | ---| ---| ---| ---|
 | 0 | 初始状态|`1,1,1,1,1`| |
 | 1 | 询问尺寸`2`|`1,1,1,1,1`|`0`|
 | 2 | 合并`1,2`|`2,1,1,1`| |
 | 3 | 询问尺寸`2`|`2,1,1,1`|`1`|
 | 4 | 询问尺寸`3`|`2,1,1,1`|`0`|
 | 5 | 合并`1,3`|`3,1,1`| |
 | 6 | 询问尺寸`3`|`3,1,1`|`1`|

 此跟踪表明只有完整的团队才算数。 尺寸的组成部分`3`可以提供一支规模的团队`3`，而较小的组件则无任何贡献。 

对于第二个样本：```
7 9
2 1
2 2
1 1 2
1 2 3
1 4 5
1 5 6
1 6 7
2 3
2 4
```| 步骤| 运营| 元件尺寸| 查询解答 |
 | ---| ---| ---| ---|
 | 0 | 初始状态|`1,1,1,1,1,1,1`| |
 | 1 | 询问尺寸`1`|`1,1,1,1,1,1,1`|`7`|
 | 2 | 询问尺寸`2`|`1,1,1,1,1,1,1`|`0`|
 | 3 | 合并`1,2`|`2,1,1,1,1,1`| |
 | 4 | 合并`2,3`|`3,1,1,1,1`| |
 | 5 | 合并`4,5`|`3,2,1,1`| |
 | 6 | 合并`5,6`|`3,3,1`| |
 | 7 | 合并`6,7`|`3,4`| |
 | 8 | 询问尺寸`3`|`3,4`|`2`|
 | 9 | 询问尺寸`4`|`3,4`|`1`|

 跟踪证实答案仅取决于组件大小，而不取决于友谊的内部安排。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O((n+q) sqrt(n) log n)`| 每次合并更改三个组件，每个组件更新使用`O(sqrt(n))`Fenwick 运算的商区间。 |
 | 空间|`O(n)`| DSU 数组和 Fenwick 树均存储线性大小的数据。 |

 约束允许大约`10^5`运营。 优化的商分解避免了线性更新成本，这将使每次合并成本过高，从而将总工作保持在所需的限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    out = []
    n, q = map(int, input().split())

    parent = list(range(n + 1))
    size = [1] * (n + 1)

    class Fenwick:
        def __init__(self, n):
            self.n = n
            self.bit = [0] * (n + 2)
        def add(self, i, v):
            while i <= self.n:
                self.bit[i] += v
                i += i & -i
        def ra(self, l, r, v):
            self.add(l, v)
            self.add(r + 1, -v)
        def get(self, i):
            s = 0
            while i:
                s += self.bit[i]
                i -= i & -i
            return s

    fw = Fenwick(n)

    def add_comp(x, d):
        l = 1
        while l <= x:
            v = x // l
            r = x // v
            fw.ra(l, r, v * d)
            l = r + 1

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    add_comp(1, n)

    for _ in range(q):
        a = list(map(int, input().split()))
        if a[0] == 1:
            x, y = find(a[1]), find(a[2])
            if x != y:
                add_comp(size[x], -1)
                add_comp(size[y], -1)
                parent[y] = x
                size[x] += size[y]
                add_comp(size[x], 1)
        else:
            out.append(str(fw.get(a[1])))

    sys.stdin = old
    return "\n".join(out)

assert run("""5 6
2 2
1 1 2
2 2
2 3
1 1 3
2 3
""") == "0\n1\n0\n1"

assert run("""3 3
1 1 2
1 2 1
2 2
""") == "1"

assert run("""1 3
2 1
2 2
2 1
""") == "1\n0\n1"

assert run("""6 5
1 1 2
1 2 3
1 4 5
1 5 6
2 3
""") == "2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单用户查询 |`1,0,1`| 最小规模和团队规模大于人口 |
 | 友谊重重|`1`| 忽略一个组件内的联合 |
 | 尺寸的两个组成部分`3`和`3`|`2`| 多个团体贡献团队 |

 ## 边缘情况

 当每个用户都是独自一人时，算法会插入`n`尺寸的副本`1`成分。 更新例程通过添加来处理这个问题`1`仅根据团队规模`1`，因此较大的团队规模保持为零。 

对于重复的友谊，DSU 发现两个用户具有相同的根。 由于组件大小没有变化，因此芬威克树不会受到影响，并且存储的答案仍然有效。 

对于大型组件，例如尺寸`100000`，该算法不会循环所有可能的团队规模。 相反，它在等商范围之间跳转。 即使单个朋友组包含每个用户，这也可以使更新成本保持在较低水平。
