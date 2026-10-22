---
title: "CF 118C - 花式号码"
description: "我们得到一串代表汽车号码的数字。 如果至少 k 个位置包含相同的数字，则该数字被认为是美丽的。 我们可以将任何数字更改为另一个数字，并将数字 a 更改为数字 b 成本 该任务有两个目标。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "sortings", "strings"]
categories: ["algorithms"]
codeforces_contest: 118
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 89 (Div. 2)"
rating: 1900
weight: 118
solve_time_s: 171
verified: true
draft: false
---

[CF 118C - 花式数字](https://codeforces.com/problemset/problem/118/C)

 **评级：** 1900
 **标签：** 暴力、贪婪、排序、字符串
 **求解时间：** 2m 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一串代表汽车号码的数字。 这个数字被认为是美丽的，如果至少`k`位置包含相同的数字。 我们可以将任何数字更改为另一个数字，并且更改数字`a`转换为数字`b`成本`|a - b|`。 

该任务有两个目标。 首先，最小化总改造成本。 其次，在所有最小成本答案中，返回字典顺序最小的结果字符串。 

输入大小足够小，我们可以尝试所有目标数字`0`到`9`。 字符串长度最多为`10^4`，所以任何解决方案`O(10 * n log n)`或者`O(10 * n)`是完全安全的。 对所有位置的二次方法仍然会通过这里，但我们仍然应该仔细设计逻辑，因为字典顺序的平局打破是微妙的。 

棘手的部分不是计算最小成本。 困难的部分是在所有成本最低的解决方案中产生字典顺序最小的答案。 

考虑这个例子：```
4 3
9090
```如果我们决定使三位数等于`0`，我们只需要改变一个`9`进入`0`， 成本`9`。 有两种选择：```
0090
9000
```两者的成本相同，但是`0090`按字典顺序更小。 总是首先更改最左边可能数字的粗心贪婪策略可能会导致其他目标失败。 

当转换小于目标的数字与大于目标的数字时，会出现另一个微妙的情况。 

例子：```
5 4
12345
```假设目标数字是`3`。 

改变`2 -> 3`和`4 -> 3`每项费用`1`。 

改变`1 -> 3`和`5 -> 3`每项费用`2`。 

为了在同等成本的解决方案中获得字典顺序最小的结果，我们应该：

 从左到右更改较大的数字，因为提前减少数字会使字符串变小，

 但从右到左更改较小的数字，因为增加较早的数字会使字符串变大。 

许多错误的解决方案都忽略了这种不对称性。 

另一个边缘情况是当字符串已经至少包含`k`相等的数字。 

例子：```
6 4
777712
```正确答案是成本`0`和原始字符串本身。 任何在达到后继续修改数字的算法`k`发生的事情可能会意外地使答案变得更糟。 

## 方法

 蛮力的想法很简单。 对于每个目标数字`d`从`0`到`9`，尝试将位置的每个可能的子集转换为`d`，计算总成本，并保留最好的结果。 

这在概念上是有效的，因为最终的美丽数字必须选择至少出现的一些数字`k`次。 一旦这个数字被固定，每个改变的位置都会独立地影响成本。 

问题是子集的数量。 即使我们只考虑尚未等于的位置`d`, 仍可大致有`2^n`的可能性。 和`n = 10^4`，这是没有希望的。 

关键的观察结果是成本仅取决于数字距离。 如果我们的目标数字是`d`，然后将数字与距离转换`1`总是比用距离转换数字更好`2`。 

这意味着对于每个目标数字，我们应该按照成本递增的顺序贪婪地采取立场：

 首先所有数字与距离`1`,

 然后距离`2`，

等等。 

这立即使总成本最小化。 

在确定了可能的最小成本之后，我们仍然需要字典顺序最小的字符串。 这引入了第二层贪婪。 

假设我们要转换的数字大于`d`。 用较小的数字替换较大的数字会减少字符。 在字符串中较早执行此操作可以提高字典顺序，因此我们应该从左到右处理这些位置。 

对于小于的数字`d`，替换增加了性格。 增加较早的字符会损害字典顺序，因此我们应该从右到左处理这些位置。 

这为每个目标数字提供了干净的贪婪结构。 

我们尝试所有十个目标数字，为每个数字构建最佳的字符串，然后选择：

 首先以最低成本，

 然后按字典顺序最小。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(10·2^n) | O(10·2^n) | O(n) | 太慢了 |
 | 最佳| O(10·n) | O(10·n) | O(n) | 已接受 |

 ## 算法演练

 1. 计算每个数字在字符串中出现的次数。 

如果数字`d`至少已经出现`k`次，该目标的成本立即`0`。 
2. 对于每个目标数字`d`从`0`到`9`，计算需要多少额外副本。 

让：```
need = k - count[d]
```如果`need <= 0`，当前字符串已经满足该数字的条件。 
3. 创建字符串的可变副本。 

我们将逐步将数字转换为`d`。 
4. 处理距离`1`到`9`。 

对于每个距离`dist`，最多有两个有用的源数字：`d - dist`和`d + dist`。 

这些正是转换成本等于的数字`dist`。 
5. 首先处理大于的数字`d`。 

如果`d + dist <= 9`，从左到右扫描字符串。 

每当我们看到数字`d + dist`并且仍然需要更多副本`d`，将其替换为`d`。 

用较小的数字替换较大的数字会使字符串按字典顺序更早地变小，因此从左到右是最佳选择。 
6. 然后处理小于的数字`d`。 

如果`d - dist >= 0`，从右向左扫描字符串。 

每当我们看到数字`d - dist`并且仍然需要更多副本，将其替换为`d`。 

这里我们正在增加数字。 尽可能向右延迟这些增加可以使字符串按字典顺序变小。 
7.每次替换都会增加`dist`到总成本并减少`need`一个。 

停一次`need`变为零。 
8. 将构建的候选者与当前的全球最佳者进行比较。 

更喜欢较小的总成本。 

如果成本相同，则更喜欢字典顺序较小的字符串。 

### 为什么它有效

 对于固定目标数字`d`，最小成本策略必须始终按照与`d`。 任何在较小距离可用时使用较大距离的解决方案都可以立即得到改进。 

在所有最小成本选择中，字典顺序仅取决于哪些位置发生了变化。 减少前面的数字有助于字典顺序，而增加前面的数字则会损害字典顺序。 这就是为什么较大的数字从左到右修改，较小的数字从右到左修改。 

由于我们独立计算每个可能的目标数字的最佳答案，因此这些候选数字中的全局最小值就是最佳的最终答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())
    s = input().strip()

    best_cost = float('inf')
    best_string = ""

    for target in range(10):
        cnt = s.count(str(target))
        need = k - cnt

        cur = list(s)
        cost = 0

        if need > 0:
            for dist in range(1, 10):
                if need == 0:
                    break

                bigger = target + dist
                if bigger <= 9:
                    for i in range(n):
                        if need == 0:
                            break
                        if int(cur[i]) == bigger:
                            cur[i] = str(target)
                            cost += dist
                            need -= 1

                smaller = target - dist
                if smaller >= 0:
                    for i in range(n - 1, -1, -1):
                        if need == 0:
                            break
                        if int(cur[i]) == smaller:
                            cur[i] = str(target)
                            cost += dist
                            need -= 1

        candidate = ''.join(cur)

        if cost < best_cost:
            best_cost = cost
            best_string = candidate
        elif cost == best_cost and candidate < best_string:
            best_string = candidate

    print(best_cost)
    print(best_string)

solve()
```外循环尝试每个可能的数字作为最终的重复数字。 由于只有十位数字，因此这部分实际上是恒定的。 

变量`need`跟踪我们还需要多少份目标数字。 一旦达到零，当前候选就完成了。 

修改的顺序是实现中最微妙的部分。 

当将较大的数字转换为目标时，我们从左到右扫描：```
for i in range(n):
```因为减少前面的数字可以改善字典顺序。 

当将较小的数字转换为目标时，我们从右向左扫描：```
for i in range(n - 1, -1, -1):
```因为从字典顺序上增加后面的数字危害较小。 

另一个微妙的细节是我们修改`cur`，不是原始字符串`s`。 原始计数仅用于确定最初需要多少更换。 

比较步骤必须首先检查成本，然后检查字典顺序。 Python 字符串比较已经正确实现了字典顺序。 

## 工作示例

 ### 示例 1

 输入：```
6 5
898196
```假设我们尝试目标数字`8`。 

初始计数`8`是`2`， 所以：```
need = 5 - 2 = 3
```| 距离 | 行动| 字符串| 成本| 需要|
 | ---| ---| ---| ---| ---|
 | 1 | 先改变`9 -> 8`| 888196 | 1 | 2 |
 | 1 | 改变第二`9 -> 8`| 888186 | 2 | 1 |
 | 2 | 改变`6 -> 8`| 888188 | 4 | 0 |

 最终候选人：```
888188
```该轨迹显示了为什么首先采取较小的距离是最佳的。 在使用两者之前使用更昂贵的转换的任何解决方案`9`会浪费成本。 

### 示例 2

 输入：```
5 4
12345
```尝试目标数字`3`。 

初始计数`3`是`1`， 所以：```
need = 3
```| 距离 | 行动| 字符串| 成本| 需要|
 | ---| ---| ---| ---| ---|
 | 1 | 改变`4 -> 3`从左起 | 12335 | 1 | 2 |
 | 1 | 改变`2 -> 3`从右| 13335 | 2 | 1 |
 | 2 | 改变`5 -> 3`| 13333 | 4 | 0 |

 最终候选人：```
13333
```此示例演示了不对称遍历顺序。 从右侧增加较小的数字可以更好地保留字典顺序。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(10·n) | O(10·n) | 我们尝试 10 个目标数字并扫描字符串固定次数 |
 | 空间| O(n) | 字符串的可变副本 |

 该算法完全符合限制。 即使与`n = 10^4`，总工作量只有几十万次操作。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n, k = map(int, input().split())
    s = input().strip()

    best_cost = float('inf')
    best_string = ""

    for target in range(10):
        cnt = s.count(str(target))
        need = k - cnt

        cur = list(s)
        cost = 0

        if need > 0:
            for dist in range(1, 10):
                if need == 0:
                    break

                bigger = target + dist
                if bigger <= 9:
                    for i in range(n):
                        if need == 0:
                            break
                        if int(cur[i]) == bigger:
                            cur[i] = str(target)
                            cost += dist
                            need -= 1

                smaller = target - dist
                if smaller >= 0:
                    for i in range(n - 1, -1, -1):
                        if need == 0:
                            break
                        if int(cur[i]) == smaller:
                            cur[i] = str(target)
                            cost += dist
                            need -= 1

        candidate = ''.join(cur)

        if cost < best_cost:
            best_cost = cost
            best_string = candidate
        elif cost == best_cost and candidate < best_string:
            best_string = candidate

    print(best_cost)
    print(best_string)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    return sys.stdout.getvalue()

# provided sample
assert run(
"""6 5
898196
"""
) == "4\n888188\n", "sample 1"

# already beautiful
assert run(
"""6 4
777712
"""
) == "0\n777712\n", "already valid"

# minimum size
assert run(
"""2 2
10
"""
) == "1\n00\n", "minimum size case"

# lexicographical tie handling
assert run(
"""4 3
9090
"""
) == "9\n0090\n", "lexicographically smallest among equal costs"

# all digits equal
assert run(
"""5 5
33333
"""
) == "0\n33333\n", "all equal"

# boundary conversion distances
assert run(
"""3 3
090
"""
) == "9\n000\n", "large digit distance handling"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`6 4 / 777712`| 成本`0`| 已经很漂亮的输入|
 |`2 2 / 10`|`00`| 最小约束|
 |`4 3 / 9090`|`0090`| 字典顺序打破平局|
 |`5 5 / 33333`| 未更改的字符串 | 没有不必要的修改|
 |`3 3 / 090`|`000`| 大额转换成本处理 |

 ## 边缘情况

 再次考虑打破平局的例子：```
4 3
9090
```目标数字`0`已经出现两次，所以我们还需要一次`0`。 

两个都`9`成本`9`进行转换。 该算法从左到右处理较大的数字，因此它改变了第一个`9`。 

结果：```
0090
```而不是：```
9000
```两者的成本相同，但是`0090`按字典顺序更小。 

现在考虑非对称遍历问题：```
5 4
12345
```目标数字`3`。 

当处理较小的数字时，例如`2`，算法从右向左扫描。 这种延迟在接近字符串末尾时会增加。 

改变最左边的`2`太早会不必要地创建更大的词典前缀。 

最后，考虑一个已经满足要求的案例：```
6 4
777712
```位数的个数`7`已经是`4`， 所以：```
need = 0
```不会发生任何修改。 成本保持为零，并且原始字符串被准确保留。
