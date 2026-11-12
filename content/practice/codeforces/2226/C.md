---
title: "CF 2226C - 精神纪念碑（简单版）"
description: "每个数组元素都可以独立修改。 对于值$x$，我们可以选择任何正整数$b$，然后将$x$替换为$x bmod b$。 目标是最大化结果数组的 MEX。"
date: "2026-06-01T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "greedy", "math", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 2226
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 1095 (Div. 2)"
rating: 0
weight: 2226
solve_time_s: 377
verified: false
draft: false
---

[CF 2226C - 精神纪念碑（简单版）](https://codeforces.com/problemset/problem/2226/C)

 **评级：** -
 **标签：** 二分查找、数据结构、贪心、数学、两个指针
 **求解时间：** 6m 17s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 每个数组元素都可以独立修改。 对于一个值$x$，我们可以选择任何正整数$b$，然后替换$x$经过$x \bmod b$。 

目标是最大化结果数组的 MEX。 由于该操作是独立应用于每个位置的，因此问题变为：

 给定每个元素可以转换成的一组值，通过为每个元素分配一个目标值可以构造的最大 MEX 是多少？ 

这些约束是表明不打算直接构建的第一个线索。 所有测试用例的元素总数最多为$2\cdot 10^5$，而最大值之和至多为$10^6$。 这强烈表明算法的复杂性取决于值范围而不是$n^2$。 

主要困难是准确理解数字的值$x$经过一次模运算后即可变为。 

考虑几个例子。 

如果$x=6$， 然后：$$6\bmod 7=6,$$所以$6$是可达的。 

还，$$6\bmod 6=0,\quad 6\bmod 5=1,\quad 6\bmod 4=2.$$可达值是$$\{0,1,2,6\}.$$一个天真的假设是，之间的每个值$0$和$x$是可达的。 那是错误的。 例如，$3$不能从生产$6$。 

另一个容易犯的错误是认为重复的大值总是会生成任意缺失的数字。 例如：$$a=[2,2].$$每个$2$只能成为$0$或者$2$。 我们可以创造$0$，但我们永远无法创造$1$。 答案是$1$， 不是$2$。 

第三个微妙的情况是零的存在。 

为了$$a=[0,0,0],$$每个元素始终保留$0$， 因为$$0\bmod b = 0.$$结果数组永远不能包含$1$，所以答案是$1$。 

这些例子表明我们必须准确地描述可达值。 

## 方法

 暴力的观点是计算每个元素的所有可达值，然后通过元素和目标值之间的匹配来搜索可获得的最大 MEX。 

即使观察到每个值只有$O(x)$可达状态，由此产生的二分匹配公式太昂贵了。 值高达$10^6$，这种做法是完全不切实际的。 

关键的观察结果来自于对单个数字的分析$x$。 

假设我们改变模数$b$。 

如果$b>x$， 然后$$x\bmod b=x.$$如果$b\le x$，那么余数总是严格小于$x/2$。 官方社论通过分案证明了这一点$b\le x/2$和$x/2<b\le x$。 

此外，每个值$$0\le y<\frac{x}{2}$$可以通过选择来实现$$b=x-y.$$因此完整的可达集是$$R(x)=\{x\}\cup \left\{ 0,1,\dots,\left\lfloor\frac{x-1}{2}\right\rfloor \right\}.$$这种特征完全改变了问题。 

现在考虑检查是否$$\operatorname{mex}\ge k$$是可能的。 

我们需要认识到每一个数字$$0,1,\dots,k-1.$$一个值$x<k$很特别。 自从$x$本身是可以到达的，使用$x$实现$x$总是至少与使用较小的数字一样好。 任何较小的目标也可以稍后由一些足够大的值产生。 

因此，在检查时$k$，我们贪婪地保留每个值出现一次$x<k$代表$x$。 

执行此操作后，一些数字$[0,k-1]$保持不被覆盖。 让那些缺失的数字成为$$m_1<m_2<\cdots.$$每个剩余元素$x$可以精确覆盖区间$$0 \le y \le \left\lfloor\frac{x-1}{2}\right\rfloor.$$同样，它可以覆盖缺失值$m$当且仅当$$x\ge 2m+1.$$现在问题变成了一个经典的贪心匹配问题。 

逐渐对缺失的数字进行排序。 逐渐对可用的大元素进行排序。 从最小到最大处理缺失值，并始终分配可以覆盖当前缺失值的最小可用元素。 

如果在某个时刻不存在这样的元素，那么$\operatorname{mex}\ge k$是不可能的。 

由于可行性是单调的$k$，对答案进行二分查找成为可能。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力匹配| 指数或更糟 | 大| 太慢了 |
 | 二分查找+贪心检查|$O(M\log^2 M)$|$O(M)$| 已接受 |

 这里$M=\max(a)$，并且该问题保证了所有的总和$M$值最多是$10^6$。 

## 算法演练

 ### 可达到的值

 对于每个值$x$,$$R(x)= \{x\} \cup \{0,1,\dots,\lfloor (x-1)/2\rfloor\}.$$这是基本的结构事实。 

### 固定的可行性检查$k$1. 统计每个值出现的频率。 
2. 对于每一个$x<k$，如果未使用的出现$x$存在，仅保留一次出现来表示$x$。 
3. 收集所有数字$[0,k-1]$没有保留。 这些是缺失值。 
4. 每个剩余的数组元素都成为可用资源。 
5. 对于每个可用元素$x$, 计算$$t=\left\lfloor\frac{x-1}{2}\right\rfloor.$$该元素可以覆盖不超过的任何缺失值$t$。 

1.从小到大处理缺失值。 维护多组可用容量$t$。 
2. 对于缺失值$m$，选择满足的最小容量$$t\ge m.$$将其从多重集中删除。 

1. 如果不存在这样的容量，则检查失败。 
2. 如果每个缺失值都被赋值，则检查成功。 

### 二分查找

 答案介于之间$0$和$n$，因为长度的数组$n$MEX 不能大于$n$。 

二分查找最大$k$可行性检查成功。 

### 为什么它有效

 每当一个值$x<k$存在，直接分配一份副本给$x$永远不会降低可行性。 该副本的任何替代使用都会产生小于$x$， 尽管$x$那么它本身只能由另一个副本产生$x$。 立即保留此类副本始终是最佳选择。 

在这些保留之后，每个剩余元素仅通过其阈值做出贡献$$\left\lfloor\frac{x-1}{2}\right\rfloor.$$由此产生的问题是将缺失的数字与阈值进行匹配。 按升序处理缺失的数字并始终使用最小的可行阈值是标准的最优贪心策略。 任何早期使用的较大阈值只会降低未来的灵活性。 

因此，检查是正确的，并且对单调可行性谓词的二分搜索会产生最大可实现的 MEX。 

## Python 解决方案```python
import sys
from bisect import bisect_left
from collections import Counter
import heapq

input = sys.stdin.readline

def can_make(a, k):
    cnt = Counter(a)

    missing = []

    for x in range(k):
        if cnt[x] > 0:
            cnt[x] -= 1
        else:
            missing.append(x)

    caps = []

    for x, c in cnt.items():
        if c <= 0:
            continue

        if x == 0:
            cap = -1
        else:
            cap = (x - 1) // 2

        for _ in range(c):
            caps.append(cap)

    caps.sort()

    ptr = 0
    m = len(caps)

    for need in missing:
        pos = bisect_left(caps, need, ptr)
        if pos == m:
            return False
        ptr = pos + 1

    return True

def solve():
    t = int(input())

    ans = []

    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))

        lo, hi = 0, n

        while lo < hi:
            mid = (lo + hi + 1) // 2

            if can_make(a, mid):
                lo = mid
            else:
                hi = mid - 1

        ans.append(str(lo))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```频率表允许我们保留小于候选 MEX 的值的副本。 每个剩余元素都转换为一个数字，$$\left\lfloor\frac{x-1}{2}\right\rfloor,$$它完整​​地描述了它对于填充缺失值的有用性。 

排序容量贪婪匹配是通过二分搜索实现的。 该指针保证每个容量最多被使用一次。 

二分查找的范围是$[0,n]$，因为没有长度的数组$n$可以包含所有值$0,\dots,n$。 

## 工作示例

 ### 示例 1

 输入：$$[6,7]$$检查$k=2$:

 所需的值为$0$和$1$。 

| 价值| 预订的？ |
 | --- | --- |
 | 0 | 没有 |
 | 1 | 没有 |

 缺失值：$$[0,1]$$可用容量：

 | 元素| 产能 |
 | --- | --- |
 | 6 | 2 |
 | 7 | 3 |

 搭配：

 | 失踪| 选择容量|
 | --- | --- |
 | 0 | 2 |
 | 1 | 3 |

 所有缺失值都被覆盖，所以$k=2$是可行的。 

自从$n=2$，答案是$$\boxed{2}.$$### 示例 2

 输入：$$[8,1,7,6,4,3]$$检查$k=5$:

 保留副本：

 | 价值| 保留 |
 | --- | --- |
 | 0 | 没有 |
 | 1 | 是的 |
 | 2 | 没有 |
 | 3 | 是的 |
 | 4 | 是的 |

 缺失值：$$[0,2]$$剩余容量：

 | 元素| 产能 |
 | --- | --- |
 | 8 | 3 |
 | 7 | 3 |
 | 6 | 2 |

 搭配：

 | 失踪| 选择容量|
 | --- | --- |
 | 0 | 2 |
 | 2 | 3 |

 可行的。 

检查$k=6$失败是因为没有办法创造所有的价值$0,1,2,3,4,5$同时地。 

因此$$\boxed{5}.$$## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(M\log^2 n)$每次实践测试，$O(n\log n\log n)$最坏的情况| 二分查找和贪心检查|
 | 空间|$O(n)$| 频率和容量存储|

 因为所有数组长度之和最多为$2\cdot 10^5$，所有测试的总最大值最多为$10^6$，这很容易符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    from bisect import bisect_left
    from collections import Counter

    data = iter(inp.strip().split())

    t = int(next(data))
    out = []

    def can_make(a, k):
        cnt = Counter(a)

        missing = []

        for x in range(k):
            if cnt[x]:
                cnt[x] -= 1
            else:
                missing.append(x)

        caps = []

        for x, c in cnt.items():
            cap = -1 if x == 0 else (x - 1) // 2
            caps.extend([cap] * c)

        caps.sort()

        ptr = 0

        for need in missing:
            pos = bisect_left(caps, need, ptr)
            if pos == len(caps):
                return False
            ptr = pos + 1

        return True

    for _ in range(t):
        n = int(next(data))
        a = [int(next(data)) for _ in range(n)]

        lo, hi = 0, n

        while lo < hi:
            mid = (lo + hi + 1) // 2
            if can_make(a, mid):
                lo = mid
            else:
                hi = mid - 1

        out.append(str(lo))

    return "\n".join(out)

assert run("1\n4\n0 1 2 3\n") == "4"
assert run("1\n2\n6 7\n") == "2"

assert run("1\n1\n0\n") == "1"
assert run("1\n1\n5\n") == "1"
assert run("1\n2\n2 2\n") == "1"
assert run("1\n3\n0 0 0\n") == "1"
assert run("1\n5\n1000000 1000000 1000000 1000000 1000000\n") == "5"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`[0]`|`1`| 尽可能小的数组 |
 |`[5]`|`1`| 大价值只能创造一个需要的数字 |
 |`[2,2]`|`1`| 重复的值不能总是创建连续的整数 |
 |`[0,0,0]`|`1`| 零没有任何有用的能力|
 | 五份`10^6`|`5`| 大值匹配行为|

 ## 边缘情况

 考虑$$[2,2].$$每个元素的可达集是$$\{0,2\}.$$该算法尝试$k=2$。 价值$1$失踪了。 剩余容量为$$\left\lfloor\frac{2-1}{2}\right\rfloor=0,$$无法覆盖的$1$。 检查失败，产生答案$1$。 

考虑$$[0,0,0].$$对于每个元素，$$0\bmod b=0.$$每个容量变为$-1$，这意味着它不能创造任何正缺失值。 算法发现$1$无法被覆盖，所以答案是$1$。 

考虑$$[6,7].$$容量为$2$和$3$。 缺失值$0$和$1$两者都被覆盖。 算法正确返回$2$，证明即使这些数字最初没有出现在数组中，大值也可以转换为小数字。
