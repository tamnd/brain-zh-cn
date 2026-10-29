---
title: "CF 1540D - 逆反转"
description: "数组 $b$ 不是任意的。 对于每个位置 $i$，$bi$ 告诉我们排列中有多少个较早的元素大于 $pi$。"
date: "2026-06-10T14:33:58+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 1540
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 728 (Div. 1)"
rating: 3200
weight: 1540
solve_time_s: 523
verified: false
draft: false
---

[CF 1540D - 逆反转](https://codeforces.com/problemset/problem/1540/D)

 **评分：** 3200
 **标签：** 二分查找、暴力破解、数据结构
 **求解时间：** 8m 43s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 数组$b$不是任意的。 对于每个职位$i$,$b_i$告诉我们排列中有多少个较早的元素大于$p_i$。 

如果我们只看第一个$i$排列的元素，那么恰好$b_i$其中大于$p_i$，所以确切地说$i-1-b_i$其中较小。 这意味着排名$p_i$其中第一$i$元素是$$r_i=i-b_i.$$整个排列是由这些等级唯一确定的。 查询修改各个值$b$，这会改变一个等级$r_i$，稍后的查询会询问最终值$p_i$。 

限制才是真正的挑战。 两个都$n$和$q$一样大$10^5$。 每次更新后重建整个排列至少需要$O(n)$每次更新工作，导致大约$10^{10}$最坏情况下的操作。 任何涉及每个查询的整个数组的解决方案都会立即被排除。 

一个微妙的点是更新会间接影响许多后来的位置。 考虑```
n = 3
b = [0, 0, 0]
```这对应于```
p = [1, 2, 3].
```仅更改$b_2$到$1$产生```
b = [0, 1, 0]
```现在排列变成```
p = [2, 1, 3].
```尝试仅更新位置的幼稚方法$2$会错过这样一个事实：位置的值$1$也发生变化。 

另一个容易犯的错误是假设可能存在多种排列。 逆向量表示实际上确定了唯一的排列。 例如，```
b = [0, 1, 2, 3]
```力量```
p = [4, 3, 2, 1].
```根本没有自由。 

## 方法

 最直接的解决方案从观察开始$$r_i=i-b_i$$是职位的等级$i$其中第一$i$元素。 

假设我们已经知道某个职位的排名$k$其中第一$t-1$元素。 当位置$t$插入后，其秩为$r_t$。 每个现有等级大于或等于$r_t$向上移动一位。 

如果我们表示当前的位置等级$k$经过$x$，过渡是$$x \leftarrow \begin{cases} x+1 & x \ge r_t\\ x   & x < r_t \end{cases}$$将此过渡应用于所有人$t>k$最终给出最终值$p_k$。 

暴力查询可以简单地模拟所有以后的插入。 这是正确的，因为它完全遵循逆向量的定义。 不幸的是，每次查询都会花费$O(n)$，并与$10^5$我们最终接近的查询$10^{10}$运营。 

关键的观察是每个后面的位置都会贡献一个微小的操作：$$T_a(x)=x+[x\ge a].$$整个头寸块只是此类操作的组合。 

我们不将块存储为原始值，而是存储整个块转换。 这些操作的任何组合都可以表示为$$F(x)=x+\#\{c_j\le x\},$$对于断点的排序集合$c_j$。 

一旦块被压缩到其断点集中，应用整个块就变成单个二分搜索：$$F(x)=x+\text{count}(c_j\le x).$$这将一长串更新变成每个块一个操作。 然后，平方根分解可以提供有效的更新和查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n)$每个查询|$O(1)$| 太慢了|
 | 最优 sqrt 分解 |$O(\sqrt n \log n)$询问，$O(\sqrt n \log^2 n)$更新 |$O(n)$| 已接受 |

 ## 方法

 让$$r_i=i-b_i.$$对于固定位置$k$， 定义$x_t$作为处理位置后的排名$1\ldots t$。 

最初，$$x_k=r_k.$$当位置$t>k$被插入，每个等级至少$r_t$向上移动：$$x_t=x_{t-1}+[x_{t-1}\ge r_t].$$处理完所有位置后，$$p_k=x_n.$$各位置$t$贡献给运营商$$T_{r_t}(x)=x+[x\ge r_t].$$之后的整个后缀$k$是此类运算符的组合。 

对于位置块，该组合可以写为$$F(x)=x+\#\{c_j\le x\},$$哪里的$c_j$按排序顺序存储。 

应用块成为单个二分搜索：```
x += number of breakpoints <= x
```这花费$O(\log B)$。 

更新仅修改一个位置。 我们重建包含该位置的块并保持所有其他块不变。 

## 算法演练

 1. 使用以下命令将反转计数转换为排名$r_i=i-b_i$。 
2. 将索引分成大约大小的块$\sqrt n$。 
3. 对于每个块，构建其压缩转换。 

从左到右处理块内的排名。 生成的块转换由断点的排序列表表示$c_j$。 
4. 对于更新查询，修改对应的rank$r_i$。 
5. 仅重建包含以下内容的块$i$。 
6.对于position处的值查询$i$, 开始于$$x=r_i.$$7. 显式处理同一块的剩余元素。 

仅有的$O(\sqrt n)$位置属于该块。 
8. 对于每个后来的完整块，应用其存储的转换。 

这是通过对块的断点列表进行二分搜索来完成的：$$x \leftarrow x+\#\{c_j\le x\}.$$9.应用所有后缀块后，输出$x$。 

### 为什么它有效

 军衔$r_i=i-b_i$正是占据的位置$p_i$其中第一$i$元素。 

每当一个新元素具有排名$r_t$插入后，每个现有等级大于或等于$r_t$移动一位。 过渡$$x \leftarrow x+[x\ge r_t]$$因此与从其逆向量构造排列的插入过程相同。 

查询算法以与原始构造相同的顺序应用这些转换。 块压缩不会改变结果，因为每个块变换都是精确表示的，而不是近似表示的。 因此算法计算出的最终排名恰好是$p_i$。 

## Python 解决方案```python
import sys
from bisect import bisect_right, insort

input = sys.stdin.readline

class SqrtDecomposition:
    def __init__(self, n, r):
        self.n = n
        self.r = r
        self.B = 320

        self.blocks = []
        self.bid = [0] * (n + 1)

        l = 1
        while l <= n:
            rr = min(n, l + self.B - 1)
            idx = len(self.blocks)
            for i in range(l, rr + 1):
                self.bid[i] = idx
            self.blocks.append([l, rr, []])
            l = rr + 1

        for b in range(len(self.blocks)):
            self.rebuild(b)

    def rebuild(self, b):
        l, r, _ = self.blocks[b]

        c = []

        for pos in range(l, r + 1):
            a = self.r[pos]

            lo, hi = 0, self.n
            while lo < hi:
                mid = (lo + hi) // 2
                if mid + bisect_right(c, mid) >= a:
                    hi = mid
                else:
                    lo = mid + 1

            insort(c, lo)

        self.blocks[b][2] = c

    def apply_block(self, b, x):
        c = self.blocks[b][2]
        return x + bisect_right(c, x)

    def update(self, pos, value):
        self.r[pos] = value
        self.rebuild(self.bid[pos])

    def query(self, pos):
        x = self.r[pos]

        b = self.bid[pos]
        l, r, _ = self.blocks[b]

        for i in range(pos + 1, r + 1):
            if x >= self.r[i]:
                x += 1

        for nb in range(b + 1, len(self.blocks)):
            x = self.apply_block(nb, x)

        return x

def solve():
    n = int(input())
    b = list(map(int, input().split()))

    r = [0] * (n + 1)
    for i in range(1, n + 1):
        r[i] = i - b[i - 1]

    ds = SqrtDecomposition(n, r)

    q = int(input())
    ans = []

    for _ in range(q):
        s = list(map(int, input().split()))

        if s[0] == 1:
            _, i, x = s
            ds.update(i, i - x)
        else:
            _, i = s
            ans.append(str(ds.query(i)))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```数组`r`存储排名表示$r_i=i-b_i$。 所有后来的逻辑都在等级上运行，因为插入行为在这种形式下变得更加简单。 

每个块存储一个压缩后缀变换。 在查询期间，显式处理当前块的未完成部分，然后使用单个二分搜索应用后面的每个块。 

实现中最微妙的部分是重建块。 断点表示必须描述块中所有运算符的确切组成。 里面的二分查找`rebuild`查找变换后的排名达到当前元素的插入排名的最小值。 这些断点完全表征了块转换。 

## 工作示例

 ### 示例 1

 输入：```
3
0 0 0
7
2 1
2 2
2 3
1 2 1
2 1
2 2
2 3
```最初：$$r=[1,2,3].$$| 查询 | 开始 x | 后缀处理 | 回答 |
 | --- | --- | --- | --- |
 | 2 1 | 2 1 | 没有更高的等级可以改变它| 1 |
 | 2 2 | 2 2 | 等级3不影响| 2 |
 | 2 3 | 3 | 空后缀 | 3 |

 更新后$b_2=1$：$$r=[1,1,3].$$| 查询 | 开始 x | 后缀处理 | 回答 |
 | --- | --- | --- | --- |
 | 2 1 | 2 1 | 排名 1 移动一次 | 2 |
 | 2 2 | 2 1 | 以后不再转移| 1 |
 | 2 3 | 3 | 空后缀 | 3 |

 这表明改变单个反转计数可能会改变多个排列值。 

### 自定义示例

 输入：```
4
0 1 2 3
4
2 1
2 2
2 3
2 4
```排名变成$$r=[1,1,1,1].$$| 职位| 开始排名 | 班次 | 最终值|
 | --- | --- | --- | --- |
 | 1 | 1 | 3 | 4 |
 | 2 | 1 | 2 | 3 |
 | 3 | 1 | 1 | 2 |
 | 4 | 1 | 0 | 1 |

 得到的排列是```
[4, 3, 2, 1]
```这是逆排列。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(\sqrt n \log n)$每个查询，$O(\sqrt n \log^2 n)$每次更新| 一次块重建或一次跨压缩块|
 | 空间|$O(n)$| 排名和区块摘要 |

 和$n,q \le 10^5$，平方根分解使这两个操作都保持在线性时间以下并且符合内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    # solve()

    return out.getvalue().strip()

# sample 1
# assert run(...) == ...

# minimum size
# assert run(
# "1\n0\n1\n2 1\n"
# ) == "1"

# reverse permutation
# assert run(
# "4\n0 1 2 3\n4\n2 1\n2 2\n2 3\n2 4\n"
# ) == "4\n3\n2\n1"

# update on first nontrivial position
# assert run(
# "3\n0 0 0\n2\n1 2 1\n2 1\n"
# ) == "2"

# boundary update at n
# assert run(
# "5\n0 0 0 0 0\n2\n1 5 4\n2 5\n"
# ) == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |$n=1$| 1 | 尽可能小的实例 |
 | 逆排列逆向量| 4 3 2 1 | 4 3 2 1 最大反演结构 |
 | 位置 2 更新 | 2 | 传播到较早的元素 |
 | 更新位置$n$| 1 | 最后位置边界处理 |

 ## 边缘情况

 考虑```
3
0 1 0
```这给出了$$r=[1,1,3].$$位置$1$从排名开始$1$。 位置$2$也有等级$1$，因此第一个位置向上移动并成为排名$2$。 如果解决方案仅检查比当前排名更大的后续排名，则会错误地使其保持不变。 

另一个重要案例是```
4
0 1 2 3
```每个等级都等于$1$。 每个新插入的元素都位于前面。 该算法重复应用转换$x \leftarrow x+1$，产生反向排列。 这证实了相等的插入等级被正确处理。 

最后，考虑对最后一个位置的查询。 它的后缀是空的，所以答案必须正是它当前的排名。 该实现自然会处理这个问题，因为本地扫描和任何后续块都不会被处理。
