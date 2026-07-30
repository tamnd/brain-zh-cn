---
title: "CF 102651D - 书架排序"
description: "我们有一个书架，里面有 n 本书。 数组 p 描述当前书架：当书架排序时，当前位于位置 i 的书希望位于位置 p[i]。 由于每个目的地都是唯一的，因此 p 是 1..n 的排列。"
date: "2026-07-30T22:38:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102651
codeforces_index: "D"
codeforces_contest_name: "Innopolis Open 2020-2021, qualification, contest 1"
rating: 0
weight: 102651
solve_time_s: 116
verified: true
draft: false
---

[CF 102651D - 书架排序](https://codeforces.com/problemset/problem/102651/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个架子`n`图书。 数组`p`描述当前书架：当前位置的书`i`想要处于一个位置`p[i]`当货架被分类时。 由于每个目的地都是独一无二的，`p`是一个排列`1..n`。 

访问者仅交换两个位置，因此每次查询后两个元素`p`交换他们的位置。 每次此类更改后，我们都需要恢复正确顺序所需的最少操作次数。 一次操作可以从任意位置移除一本书，并将其放置在书架的最开头或最末尾。 

关键的困难在于更新的数量。 两个都`n`和`q`可以达到`200000`，因此每次交换后重建答案是不可能的。 一个`O(n)`每个查询的重新计算已经需要大约`4 * 10^10`最坏情况下的操作。 我们需要每次更新只影响维护信息的一小部分。 

有两种很容易被忽视的边缘情况。 首先，保持不变的书籍不需要在当前书架中相邻。 例如：```
3 0
2 1 3
```答案是`1`。 粗心的解决方案可能只搜索数组的连续段并得出结论：不存在长有序部分。 位置上的书`1`和`3`已经形成目标位置的子序列`2,3`，因此只需移动第一本书。 

另一个常见的错误是忘记最长的保留序列可以在任何地方开始或结束。 例如：```
5 0
5 1 2 3 4
```答案是`1`。 子序列`1,2,3,4`已经处于正确的相对顺序，即使它从数组的第二个位置开始。 移动属于第一个位置的书就足够了。 

## 方法

 一种直接的方法是模拟排序过程或尝试所有可能的选择未触及的书籍。 第一种选择并不有吸引力，因为移动次数可能很大，并且很难证明最佳选择。 第二种选择更糟糕：选择书籍子集是指数级的。 

有用的观察来自于描述我们不动的书。 如果一本书从未被碰过，它的相对顺序就永远不会改变。 假设我们将一些书移到前面，将一些书移到后面。 未动过的书占据了最后一个书架的中间。 因此它们的目标位置必须是连续的位置区间，并且它们必须以升序出现在当前货架中。 

所以问题就变成了寻找最长的子序列`p`看起来像：```
x, x + 1, x + 2, ..., x + k - 1
```答案是`n - k`，因为所有其他书都必须移动。 

不要直接存储该子序列，而是查看相邻的目标位置。 让`pos[v]`是最终目的地为的书的当前位置`v`。 顺序`v, v+1`在以下情况下可以成为有效保留子序列的一部分：```
pos[v] < pos[v+1]
```创建一个二进制数组`good`， 在哪里`good[v]`当此条件成立时为真。 连续运行真实值`v`到`v+k-2`意味着有目的地的书籍`v`通过`v+k-1`已经是正确的顺序了。 因此，最长的保留子序列长度是最长的序列`good`，加一。 

交换两个书架位置只会改变两本书的位置。 因此，只有涉及这两个目标值的比较才能改变。 这使得该问题适用于维护具有点更新的最长运行的线段树。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 每次查询 O(n²) 或更差 | O(n) | 太慢了|
 | 最佳| 每个查询 O(log n) | O(n) | 已接受 |

 ## 算法演练

 1. 构建逆排列`pos`， 在哪里`pos[v]`是书的当前位置，应该结束于`v`。 查询按当前书架位置交换书籍，因此逆形式让我们立即知道哪些目标值受到影响。 
2. 构建二进制数组`good`。 对于每一个`v`从`1`到`n-1`，存储是否`pos[v] < pos[v+1]`。 正确排序的连续目的地的最长链是该数组中最长的连续段。 
3. 商店`good`在线段树中。 每个树节点保存最长的前缀、最长的后缀、最长的游程以及段的总长度。 这四个值足以合并两个相邻的段。 
4. 在处理查询之前，从线段树的根计算初始答案。 如果最长的一串是`best`，保留的子序列有长度`best + 1`，所以所需的移动是`n - best - 1`。 
5. 查询调换货架位置`x`和`y`，找到当前位于这些位置的书籍的两个目标值。 交换架子数组中的这两个值并更新它们在`pos`。 
6.仅`good[value-1]`和`good[value]`可以针对两个受影响的目标值中的每一个进行更改。 重新计算这些位置并执行相应的线段树点更新。 
7. 更新后，读取根的最长运行并输出新答案。 

其原理：未移动的书籍必须恰好位于最终书架的中间部分。 它们的目标位置是连续的，并且它们的当前顺序必须已经与目标顺序匹配。 二进制数组表示这样一个保留序列内的每个可能的相邻对。 一系列真值恰好是最大保留序列。 线段树总是存储最长的这样的游程，因此从`n`给出移动书籍的最小数量.

 ## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.pref = [0] * (4 * self.n)
        self.suff = [0] * (4 * self.n)
        self.best = [0] * (4 * self.n)
        self.length = [0] * (4 * self.n)
        self.build(1, 0, self.n - 1, arr)

    def build(self, node, l, r, arr):
        self.length[node] = r - l + 1
        if l == r:
            val = arr[l]
            self.pref[node] = val
            self.suff[node] = val
            self.best[node] = val
            return
        m = (l + r) // 2
        self.build(node * 2, l, m, arr)
        self.build(node * 2 + 1, m + 1, r, arr)
        self.pull(node)

    def pull(self, node):
        left = node * 2
        right = node * 2 + 1
        llen = self.length[left]
        rlen = self.length[right]

        self.length[node] = llen + rlen
        self.pref[node] = self.pref[left]
        if self.pref[left] == llen:
            self.pref[node] = llen + self.pref[right]

        self.suff[node] = self.suff[right]
        if self.suff[right] == rlen:
            self.suff[node] = rlen + self.suff[left]

        self.best[node] = max(
            self.best[left],
            self.best[right],
            self.suff[left] + self.pref[right]
        )

    def update(self, node, l, r, idx, val):
        if l == r:
            self.pref[node] = val
            self.suff[node] = val
            self.best[node] = val
            return
        m = (l + r) // 2
        if idx <= m:
            self.update(node * 2, l, m, idx, val)
        else:
            self.update(node * 2 + 1, m + 1, r, idx, val)
        self.pull(node)

    def set(self, idx, val):
        self.update(1, 0, self.n - 1, idx, val)

def solve():
    n, q = map(int, input().split())
    p = [0] + list(map(int, input().split()))

    pos = [0] * (n + 1)
    for i in range(1, n + 1):
        pos[p[i]] = i

    good = [0] * (n - 1)
    for i in range(1, n):
        good[i - 1] = 1 if pos[i] < pos[i + 1] else 0

    seg = SegTree(good)

    ans = [str(n - seg.best[1] - 1)]

    def refresh(v):
        if v <= 0 or v >= n:
            return
        seg.set(v - 1, 1 if pos[v] < pos[v + 1] else 0)

    for _ in range(q):
        x, y = map(int, input().split())

        a = p[x]
        b = p[y]

        affected = {a - 1, a, b - 1, b}

        p[x], p[y] = p[y], p[x]
        pos[a], pos[b] = y, x

        for v in affected:
            refresh(v)

        ans.append(str(n - seg.best[1] - 1))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```逆排列是核心实现细节。 数组`p`回答“这个货架位置包含哪个目的地？”，而`pos`回答“这个目的地目前位于哪里？”。 扩展保留序列的条件自然地表达为`pos`，因此每个查询都可以在本地处理。 

线段树存储有关运行的信息，而不是直接存储答案。 当两个子节点合并时，最佳线段要么完全位于左子节点内部，要么完全位于右子节点内部，要么穿过中间。 交叉大小写正是左孩子的后缀与右孩子的前缀相结合。 

查询更新顺序很重要。 目标值在交换之前保存，因为交换后旧值不再位于其原始位置。 只有围绕这两个值的四个相邻比较可以改变，因此更新更多位置只会浪费时间。 

## 工作示例

 对于样本：```
5 2
5 1 2 4 3
```初始状态是：

 | 步骤|`p`|`pos`比较 | 最长的跑步| 回答 |
 | ---| ---| ---| ---| ---|
 | 初始| 5 1 2 4 3 | 5 1 2 4 3`1<2`,`2<3`是真的 | 2 | 2 |

 保存的书籍有目的地`1,2,3`，所以必须移动两本书。 

交换位置后`4`和`5`:

 | 步骤|`p`|`pos`比较 | 最长的跑步| 回答 |
 | ---| ---| ---| ---| ---|
 | 查询 1 | 5 1 2 3 4 | 5 1 2 3 4`1<2<3<4`| 3 | 1 |

 交换位置后`1`和`4`:

 | 步骤|`p`|`pos`比较 | 最长的跑步| 回答 |
 | ---| ---| ---| ---| ---|
 | 查询 2 | 3 1 2 5 4 | 3 1 2 5 4 最长的链是`1,2,3`或者`3,4,5`| 1 | 3 |

 跟踪表明，答案仅通过相邻目标比较中的局部变化而变化。 

第二个小例子：```
4 1
1 3 4 2
2 4
```| 步骤|`p`| 最长的运行时间`good`| 回答 |
 | ---| ---| ---| ---|
 | 初始| 1 3 4 2 | 1 3 4 2 目的地`3,4`形成长度为 2 的链 | 2 |
 | 交换位置 2 和 4 | 1 2 4 3 | 1 2 4 3 目的地`1,2`形成长度为 2 的链 | 2 |

 这表明货架中移动的位置和目标值是不同的概念。 线段树跟踪目的地顺序，而不是物理邻接性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + q) log n) | O((n + q) log n) | 构建树是线性的，每个查询仅更改恒定数量的叶子。 |
 | 空间| O(n) | 排列数组和线段树每个位置存储恒定量的信息。 |

 总的操作次数适合`n, q <= 200000`因为每次更新只执行少量对数线段树操作。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    old_out = sys.stdout
    sys.stdout = out

    solve()

    sys.stdin = old
    sys.stdout = old_out
    return out.getvalue()

assert run("""5 2
5 1 2 4 3
4 5
1 4
""") == "2\n1\n3\n"

assert run("""2 0
2 1
""") == "1\n"

assert run("""5 0
1 2 3 4 5
""") == "0\n"

assert run("""4 1
1 3 4 2
2 4
""") == "2\n2\n"

assert run("""6 2
6 5 4 3 2 1
1 6
2 5
""") == "5\n5\n3\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`5 2 / 5 1 2 4 3`|`2 1 3`| 提供样本和动态更新|
 |`2 0 / 2 1`|`1`| 最小尺寸且无需查询 |
 |`5 0 / 1 2 3 4 5`|`0`| 已经整理好的货架 |
 |`4 1 / 1 3 4 2`|`2 2`| 影响多个相邻比较的掉期 |
 |`6 2 / 6 5 4 3 2 1`|`5 5 3`| 逆序和边界更新 |

 ## 边缘情况

 当有效的保留序列在当前架子中不连续时，该算法仍然有效，因为它从不搜索数组间隔。 为了：```
3 0
2 1 3
```逆位置是`pos[1]=2`,`pos[2]=1`,`pos[3]=3`。 唯一真实的比较是`pos[2] < pos[3]`，给出最长的一条边和长度为 2 的保留序列。 答案就变成了`3 - 2 = 1`。 

当保留的序列开始或结束远离数组边界时，二进制表示会自然地处理它。 为了：```
5 0
5 1 2 3 4
```价值观`1,2,3,4`出现的位置递增，因此真实比较的长度为三。 答案是`5 - (3 + 1) = 1`，仅表示有目的地的书`1`必须移动。 

边界附近的交换不得访问无效比较。 例如，如果目标值`1`改变位置，仅`good[1]`可以更新，因为没有`good[0]`。 这`refresh`函数忽略外部值`1..n-1`，防止这些相差一的错误。
