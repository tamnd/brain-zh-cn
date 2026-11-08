---
title: "CF 2006C - Eri 和扩展集"
description: "对于给定数组的每个子数组，我们将其所有值放入一个集合中，删除重复项。 从该集合开始，我们可以重复选择两个平均值为整数的现有数字并插入该平均值。"
date: "2026-06-08T13:32:58+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "divide-and-conquer", "math", "number-theory", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 2006
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 969 (Div. 1)"
rating: 2300
weight: 2006
solve_time_s: 173
verified: false
draft: false
---

[CF 2006C - Eri 和扩展集](https://codeforces.com/problemset/problem/2006/C)

 **评分：** 2300
 **标签：** 数据结构、分而治之、数学、数论、两个指针
 **求解时间：** 2m 53s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 对于给定数组的每个子数组，我们将其所有值放入一个集合中，删除重复项。 从该集合开始，我们可以重复选择两个平均值为整数的现有数字并插入该平均值。 

如果在有限多次这样的插入之后，该集合可以成为连续整数的块，则该子数组被称为辉煌的。 

任务是计算有多少个子数组是优秀的。 

第一个挑战是了解平均操作实际发生的变化。 该操作永远不会创建当前最小值和最大值之间的间隔之外的值。 它仅填充该区间内的缺失点。 

第二个挑战是输入大小。 在所有测试用例中，总长度最多为$4 \cdot 10^5$。 对所有子阵列进行二次扫描大约需要$8 \cdot 10^{10}$最坏情况下的操作，远远超出了极限。 任何可接受的解决方案必须接近线性或$O(n \log n)$。 

一些边缘情况很容易被忽略。 

考虑一个完全由相等值组成的子数组：```
[5, 5, 5]
```套装很简单$\{5\}$，这已经是连续的了。 任何盲目计算差异的最大公约数的解决方案都必须处理根本不存在非零差异的事实。 

考虑：```
[1, 5]
```唯一的区别是$4$。 我们可以插入$3$， 然后$2$， 然后$4$，最终获得每个整数$1$到$5$。 尽管最初的集合远非连续，但答案非常出色。 

现在考虑：```
[1, 7]
```区别在于$6$。 我们创造的每一个价值都将与$1 \pmod 2$。 我们永远无法同时获得奇数和偶数，因此连续的区间是不可能的。 

这些例子表明，决定性的数量不是范围，而是所有差异的 gcd 结构。 

## 方法

 强力解决方案将枚举每个子数组，构建相应的集合，模拟中点插入下的闭包，并测试是否可以达到连续间隔。 

模拟本身就已经很昂贵了。 有$O(n^2)$子数组，甚至描述闭包也可能需要多次插入。 这种做法是完全不可行的。 

关键的观察结果来自于研究平均保留的内容。 

获取集合中已排序的不同值，并从每个元素中减去最小值。 翻译对过程没有任何改变。 之后，每个元素都是$$g = \gcd(x_2-x_1,\;x_3-x_2,\ldots).$$当我们插入平均值时，我们正在替换两个倍数$g$的另一个倍数$g/2$如果可能的话。 重复这个过程只能将 gcd 除以 2 的幂。 最终闭包恰好包含间隔的数字$$\frac{g}{2^k},$$其中两个的所有因子都已被删除$g$。 该集合可以成为连续的当且仅当最终间距为$1$，这意味着$g$不包含奇质因数。 等价地，$g$必须是二的幂。 这正是编辑的观察。 

对于子数组$[l,r]$，相关的 gcd 是其值的所有成对差值的 gcd。 标准身份给出$$\gcd(a_{l+1}-a_l,\ldots,a_r-a_{r-1})$$使用绝对值。 

定义$$d_i = |a_{i+1}-a_i|.$$那么长度至少为 2 的子数组是优秀的，当且仅当差数组中相应段的 gcd 是 2 的幂。 单元素子数组总是很出色。 

现在问题变成：

 计算 gcd 为 2 的幂的差分数组的段数。 

公认的两指针解决方案在差异数组上维护一个滑动窗口 gcd。 因为 gcd 仅在窗口扩展时减小，所以 gcd 不再是 2 的幂的第一个位置单调移动。 这在使用类似队列的 gcd 结构后给出了整体线性扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^2 \cdot \text{simulation})$| 大| 太慢了|
 | 最优二指针+GCD队列|$O(n)$摊销|$O(n)$| 已接受 |

 ## 算法演练

 让$$d_i = |a_{i+1}-a_i|$$为了$0 \le i < n-1$。 

一个子数组$a[l..r]$和$l<r$对应差异段$d[l..r-1]$。 

### 1.构建差异数组

 对于每个相邻对，存储其绝对差。 

当一个子数组对应的差值段的 gcd 是 2 的幂时，它就是优秀的。 

### 2. 谨慎处理零差异

 如果多个连续值相等，则差异数组包含零。 

仅包含零的 gcd 并不自然地适合二的幂测试，但原始子数组非常出色，因为它的集合的大小为一。 

该实现将这些零运行分开分组，与官方的两指针解决方案完全相同。 

### 3.维护滑动窗口gcd

 使用标准的两栈gcd队列。 

该结构支持：

 - 附加到右侧，
 - 从左侧删除，
 - 查询当前窗口的gcd。 

所有业务均摊销$O(1)$。 

### 4.移动右边界

 对于每个左边界，扩展右边界，同时窗口 gcd **不是** 2 的幂。 

gcd 成为 2 的幂的第一个位置也决定了所有较大的右端点，因为缩小窗口只能增加 gcd，而扩展只能减少它。 

### 5. 计算有效子数组的数量

 一旦知道最小的有效右端点，每个较大的端点也是有效的。 

将此类端点的数量添加到答案中。 

单元素子数组单独计数。 

### 为什么它有效

 对于任何整数集，求平均值只能从所有差异的最大公约数中删除因子 2。 奇质因数永远不会消失。 当最终 gcd 等于时，闭包将成为连续间隔$1$，当原始 gcd 是 2 的幂时，就会发生这种情况。 

对于子数组，该 gcd 等于子数组内相邻绝对差值的 gcd。 因此，问题简化为检查差异数组的 gcd 段是否是 2 的幂。 

滑动窗口准确地保持了 gcd。 窗口扩展下 gcd 的单调性保证了无效右端点和有效右端点之间的边界仅向前移动，从而给出线性两指针计数。 

## Python 解决方案```python
import sys
from math import gcd

input = sys.stdin.readline

def is_pow2(x):
    return x > 0 and (x & (x - 1)) == 0

class GCDQueue:
    def __init__(self):
        self.left = []
        self.right = []

    def push(self, x):
        g = x if not self.right else gcd(self.right[-1][1], x)
        self.right.append((x, g))

    def _move(self):
        while self.right:
            x = self.right.pop()[0]
            g = x if not self.left else gcd(self.left[-1][1], x)
            self.left.append((x, g))

    def pop(self):
        if not self.left:
            self._move()
        self.left.pop()

    def query(self):
        if not self.left:
            return self.right[-1][1] if self.right else 0
        if not self.right:
            return self.left[-1][1]
        return gcd(self.left[-1][1], self.right[-1][1])

    def size(self):
        return len(self.left) + len(self.right)

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))

        if n == 1:
            out.append("1")
            continue

        d = [abs(a[i + 1] - a[i]) for i in range(n - 1)]
        m = n - 1

        ans = n
        q = GCDQueue()
```
