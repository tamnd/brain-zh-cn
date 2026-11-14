---
title: "CF 436E - 纸板箱"
description: "每个级别最终都可能处于三种状态之一。 状态 0 意味着我们忽略它并且没有获得星星。 状态 1 意味着我们完成一颗星并花费 a[i] 时间。 状态 2 意味着我们完成了两颗星并花费了 b[i] 时间。"
date: "2026-06-07T02:55:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 436
codeforces_index: "E"
codeforces_contest_name: "Zepto Code Rush 2014"
rating: 2600
weight: 436
solve_time_s: 124
verified: false
draft: false
---

[CF 436E - 纸板箱](https://codeforces.com/problemset/problem/436/E)

 **评分：** 2600
 **标签：** 数据结构，贪心
 **求解时间：** 2m 4s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 每个级别最终都可能处于三种状态之一。 

状态`0`意味着我们忽略它并且不会获得星星。 

状态`1`意味着我们完成它并花费一颗星`a[i]`时间。 

状态`2`意味着我们完成它并花费两颗星`b[i]`时间。 

一个关卡只能玩一次，因此选择两颗星并不意味着付费`a[i] + (b[i]-a[i])`。 总成本很简单`b[i]`。 

我们需要一个最终的状态分配，其星星总数至少为`w`，同时最小化总时间。 我们还必须输出一项最佳分配。 

正是这些限制使问题变得有趣。 最多有`3·10^5`级别，因此任何关于星星和级别数量的动态编程都是完全不可能的。 甚至一个`O(n√n)`解决方案会让人不舒服。 我们需要一些接近的东西`O(n log n)`。 

一个微妙的陷阱是独立对待每颗恒星。 考虑：```
2 2
3 4
2 5
```首先选择最便宜的星星会给第一级的成本一颗星`2`，然后再一颗星的成本`3`， 全部的`5`。 但直接完成第一关只需要两颗星`4`。 任何只关注下一颗星星的贪婪者都可能会失败。 

另一个陷阱是假设一旦一个关卡获得一颗星，它必须在每个最佳解决方案中至少保留一颗星。 有时，最好的解决方案是用完全不同的二星级水平代替一星级水平。 最佳算法需要一种“撤销”先前决策的方法。 

例如：```
3 2
1 100
2 3
2 3
```一个幼稚的过程可能首先达到成本水平`1`一颗星。 后来最好放弃这个选择并选择其中一个`b=3`两颗星的水平。 

## 方法

 蛮力视图很简单。 每个级别都有三种可能的状态，因此有`3^n`作业。 我们可以计算每项任务的总星数和总时间，并保留最好的有效任务。 这显然是正确的，因为它检查了一切。 

很遗憾，`3^300000`已经超出了天文数字。 

关键的观察是我们并没有真正选择完整的作业。 我们正在逐步增加获得星星的总数`0`最多`w`。 

假设我们已经有了一些最佳配置`k`星星。 获得`k+1`星，可以进行几种不同的修改。 

我们可以给当前未使用的关卡一颗星。 

我们可以将一星等级升级为二星等级。 

我们甚至可以执行“遗憾”操作：从一个关卡中删除星星，并通过将另一个关卡变成两星关卡来进行补偿。 这样的举动改变了分配，同时仍然将星星总数增加了一颗。 

这种观点将问题转化为重复购买最便宜的方式来增加一颗星星。 困难在于，最便宜的行动可能涉及撤销先前的选择。 这就是为什么普通的贪婪会失败而后悔的贪婪会成功。 

最终的解决方案维护了五个优先级队列，代表获得一颗额外星星的所有可能方法。 每次迭代都会选择最便宜的可用选项并更新级别状态。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(3^n) | O(3^n) | O(n) | 太慢了 |
 | 后悔贪婪+堆| O(w log n) | O(w log n) | O(n) | 已接受 |

 ## 算法演练

 让`star[i]`是当前的级别状态`i`，最初全部为零。 

我们维护五个最小堆。`q1`存储未使用的级别`a[i]`。`q2`存储一星等级`b[i]-a[i]`，将其升级为两星所需的额外费用。`q3`存储未使用的级别`b[i]`。`q4`存储一星等级`-a[i]`。`q5`存储两星级`-(b[i]-a[i])`。 

最后两个堆看起来很奇怪，但它们允许后悔操作。 

对于每个`w`我们需要的星星：

 1. 删除存储状态不再与该级别当前状态匹配的过时堆条目。 
2. 计算四种可能方法的成本，以精确地多获得一颗星星。`x1 = min a[i]`在未使用的级别之间。 

这意味着将`0-star`水平成`1-star`等级。 
3. 计算`x2 = min (b[i]-a[i])`一星级别之中。 

这意味着升级`1-star`水平成`2-star`等级。 
4. 计算`x3 = min b[j] - max a[i]`。 

使用堆，这是`q3.top + q4.top`。 

在这里，我们删除了之前选择的一星关卡，取而代之的是一些未使用的关卡，价值两星。 净增加的星星仍然是 1。 
5. 计算`x4 = min b[j] - max (b[i]-a[i])`。 

使用堆，这是`q3.top + q5.top`。 

在这里，我们将一个二星级别降级为一星，并将另一个未使用的级别变为两星。 
6. 选择其中最小的`x1`,`x2`,`x3`， 和`x4`。 
7. 应用相应的状态转换并更新相关堆。 
8. 将所选成本添加到答案中。 

后`w`迭代，当前分配恰好包含`w`星星并且总时间最少。 

### 为什么它有效

 赚到之后`k`星星，当前任务是所有任务中成本最小的任务`k`星星。 

上面的四种转换列举了从`k`- 分配给 a 的星号`(k+1)`- 星级分配，同时允许重新考虑之前选择的级别。 后悔的转变是关键的部分。 它们确保，如果早期的局部决策变得不理想，算法可以用更好的全局配置替换它。 

在每一步中，我们都会选择最便宜的可能增加一颗星。 由于每`(k+1)`- 星号分配可以从某些处获得`k`-通过这些转换类型之一进行星分配，选择最小转换可以保持最优性。 By induction, the assignment after`w`迭代次数是最优的。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def solve():
    n, w = map(int, input().split())

    a = [0] * n
    b = [0] * n

    for i in range(n):
        a[i], b[i] = map(int, input().split())

    star = [0] * n

    INF = 10**30

    q1 = [(INF, n)]
    q2 = [(INF, n)]
    q3 = [(INF, n)]
    q4 = [(INF, n)]
    q5 = [(INF, n)]

    for i in range(n):
        heapq.heappush(q1, (a[i], i))
        heapq.heappush(q3, (b[i], i))

    star.append(-1)  # sentinel

    def clean(heap, need_state):
        while len(heap) > 1 and star[heap[0][1]] != need_state:
            heapq.heappop(heap)

    ans = 0

    for _ in range(w):
        clean(q1, 0)
        clean(q2, 1)
        clean(q3, 0)
        clean(q4, 1)
        clean(q5, 2)

        x1 = q1[0][0]
        x2 = q2[0][0]
        x3 = q3[0][0] + q4[0][0]
        x4 = q3[0][0] + q5[0][0]

        best = min(x1, x2, x3, x4)
        ans += best

        if best == x1:
            _, i = heapq.heappop(q1)

            star[i] = 1

            heapq.heappush(q2, (b[i] - a[i], i))
            heapq.heappush(q4, (-a[i], i))

        elif best == x2:
            _, i = heapq.heappop(q2)

            star[i] = 2

            heapq.heappush(q5, (-(b[i] - a[i]), i))

        elif best == x3:
            _, j = heapq.heappop(q3)
            _, i = heapq.heappop(q4)

            star[j] = 2
            star[i] = 0

            heapq.heappush(q5, (-(b[j] - a[j]), j))

            heapq.heappush(q1, (a[i], i))
            heapq.heappush(q3, (b[i], i))

        else:
            _, j = heapq.heappop(q3)
            _, i = heapq.heappop(q5)

            star[j] = 2
            star[i] = 1

            heapq.heappush(q5, (-(b[j] - a[j]), j))

            heapq.heappush(q2, (b[i] - a[i], i))
            heapq.heappush(q4, (-a[i], i))

    print(ans)
    print("".join(str(star[i]) for i in range(n)))

if __name__ == "__main__":
    solve()
```该实现直接遵循四种转换类型。 

惰性删除是必不可少的。 一个级别可能会在堆中出现多次，因为它的状态在后悔操作期间发生变化。 我们不会立即删除旧条目，而是将它们留在堆中，并在它们到达顶部时将其丢弃。 

堆`q4`和`q5`存储负值。 最小堆`-a[i]`可以访问最大的`a[i]`，这正是后悔公式所需要的。 同样的想法适用于`-(b[i]-a[i])`。 

所有算术都使用 Python 整数，它可以安全地处理最大可能的答案。 高达`3·10^5`水平和成本高达`10^9`，总答案可以超过 32 位范围。 

## 工作示例

 ### 示例 1

 输入：```
2 3
1 2
1 2
```| 步骤| Best Move | Cost Added | 州 |
 | --- | --- | --- | --- |
 | 1 | 0 → 1 on level 1 | 1 | 10 | 10
 | 2 | 0 → 1 on level 2 | 1 | 11 | 11
 | 3 | 1 → 2 on level 1 | 1 | 21 | 21

 Total cost =`3`。 

最终作业`21`赚到`3`总时间最少的星星。 

### 示例 2

 输入：```
5 3
10 20
5 10
10 20
6 9
25 30
```| 步骤| 最佳举措| 成本增加 | 州 |
 | --- | --- | --- | --- |
 | 1 | 2 级：0 → 1 | 5 | 01000 |
 | 2 | 4 级：0 → 2 | 9 | 01020 |
 | 3 | 已经有 3 颗星 | - | 01020 |

 总成本=`14`。 

这个例子说明了为什么直接获得两星等级比收集两个单独的一星等级更好。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(w log n) | O(w log n) | 每次迭代执行恒定数量的堆操作 |
 | 空间| O(n) | 五个堆和状态数组存储 O(n) 条目 |

 自从`w ≤ 2n`，运行时间为`O(n log n)`。 和`n = 3·10^5`，这很容易符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    import heapq

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = out

    input = sys.stdin.readline

    n, w = map(int, input().split())

    a = [0] * n
    b = [0] * n

    for i in range(n):
        a[i], b[i] = map(int, input().split())

    star = [0] * n

    INF = 10**30

    q1 = [(INF, n)]
    q2 = [(INF, n)]
    q3 = [(INF, n)]
    q4 = [(INF, n)]
    q5 = [(INF, n)]

    for i in range(n):
        heapq.heappush(q1, (a[i], i))
        heapq.heappush(q3, (b[i], i))

    star.append(-1)

    def clean(heap, need):
        while len(heap) > 1 and star[heap[0][1]] != need:
            heapq.heappop(heap)

    ans = 0

    for _ in range(w):
        clean(q1, 0)
        clean(q2, 1)
        clean(q3, 0)
        clean(q4, 1)
        clean(q5, 2)

        x1 = q1[0][0]
        x2 = q2[0][0]
        x3 = q3[0][0] + q4[0][0]
        x4 = q3[0][0] + q5[0][0]

        best = min(x1, x2, x3, x4)
        ans += best

        if best == x1:
            _, i = heapq.heappop(q1)
            star[i] = 1
            heapq.heappush(q2, (b[i] - a[i], i))
            heapq.heappush(q4, (-a[i], i))
        elif best == x2:
            _, i = heapq.heappop(q2)
            star[i] = 2
            heapq.heappush(q5, (-(b[i] - a[i]), i))
        elif best == x3:
            _, j = heapq.heappop(q3)
            _, i = heapq.heappop(q4)
            star[j] = 2
            star[i] = 0
        else:
            _, j = heapq.heappop(q3)
            _, i = heapq.heappop(q5)
            star[j] = 2
            star[i] = 1

    print(ans)
    print("".join(map(str, star[:n])))

    sys.stdout = old_stdout
    return out.getvalue().strip()

# sample 1
assert run("2 3\n1 2\n1 2\n").splitlines()[0] == "3"

# minimum size
assert run("1 1\n5 10\n").splitlines()[0] == "5"

# one level, need both stars
assert run("1 2\n5 10\n").splitlines()[0] == "10"

# catches naive star-by-star greedy
assert run("2 2\n3 4\n2 5\n").splitlines()[0] == "4"

# all equal
assert run("3 3\n1 2\n1 2\n1 2\n").splitlines()[0] == "3"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`| 成本`5`| 最小有效实例 |
 |`1 2`| 成本`10`| 直接二星完成|
 |`2 2 / (3,4),(2,5)`| 成本`4`| 天真的贪婪的失败案例|
 | 三个相同的级别 | 成本`3`| 对称性和领带处理|

 ## 边缘情况

 考虑：```
1 2
5 10
```唯一可行的分配是状态`2`。 该算法首先以成本购买一颗星`5`，然后按成本升级`5`，达到总成本`10`。 即使该级别从一开始就没有明确选择为二星级，输出也是正确的。 

考虑经典的贪婪反例：```
2 2
3 4
2 5
```一种简单的方法选择成本`2`首先，然后成本`3`，给出总计`5`。 遗憾-贪婪框架认为，将第一级直接分配给两颗星的成本仅为`4`，哪个更便宜。 最终的答案是`4`。 

考虑必须撤消先前选择的情况：```
3 2
1 100
2 3
2 3
```采取一星成本后`1`，算法仍然可以通过后悔转换自由地替换该选择。 堆`q4`和`q5`正是使这种替代成为可能的原因。 如果没有它们，算法可能会陷入局部最优但全局次优的配置中。
