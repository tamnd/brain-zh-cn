---
title: "CF 105809G - 弹珠游戏"
description: "我们有一个弹珠集合，每个弹珠都包含一个整数。 一名玩家，塞巴斯蒂安，拿走每一颗编号为奇数的弹珠。 另一名玩家塞巴斯蒂安拿走了所有数量为偶数的弹珠。 获胜者仅取决于每个玩家收到的弹珠数量。"
date: "2026-06-25T15:29:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105809
codeforces_index: "G"
codeforces_contest_name: "Code Rush 2025"
rating: 0
weight: 105809
solve_time_s: 36
verified: true
draft: false
---

[CF 105809G - 弹珠游戏](https://codeforces.com/problemset/problem/105809/G)

 **评级：** -
 **标签：** -
 **求解时间：** 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个弹珠集合，每个弹珠都包含一个整数。 一名玩家，塞巴斯蒂安，拿走每一颗编号为奇数的弹珠。 另一名玩家塞巴斯蒂安拿走了所有数量为偶数的弹珠。 

获胜者仅取决于每个玩家收到的弹珠数量。 如果计数相等，塞巴斯蒂安获胜。 我们必须输出`"Sebastian"`如果塞巴斯蒂安的弹珠数量严格来说比塞巴斯蒂安多。 否则我们输出`"Notbastian"`。 

输入由一个整数组成`n`， 其次是`n`大理石的价值。 实际值可以大到`10^9`，但只有它们的奇偶性才重要。 自从`n`至多是`10^6`，任何检查每个弹珠一次的算法都足够快，而任何比线性时间昂贵得多的算法都是不必要的。 拥有一百万个号码，`O(n)`scan 执行大约一百万次操作，这在限制范围内是微不足道的。 

错误的主要来源是平局规则。 

考虑：```
4
1 1 2 2
```有两个奇数弹珠和两个偶数弹珠。 由于计数相同，塞巴斯蒂安获胜，这意味着塞巴斯蒂安不会保留名字。 正确的输出是：```
Notbastian
```粗心的实施检查`even_count >= odd_count`会错误打印`"Sebastian"`。 

另一种容易错过的情况是所有弹珠都属于一个玩家。```
3
2 4 6
```Sebastiàn 得到了所有三个弹珠，而 Sebastian 没有得到，所以正确的输出是：```
Sebastian
```同样地：```
3
1 3 5
```给出```
Notbastian
```因为塞巴斯蒂安得到的弹珠为零。 

## 方法

 最直接的解决办法就是精确模拟规则。 对于每个弹珠，确定其数量是偶数还是奇数，并增加相应的计数器。 最后根据比赛的胜负情况比较两个计数器。 

人们可以想象一种强力解释，将塞巴斯蒂安的弹珠和塞巴斯蒂安的弹珠明确存储在单独的数组中，然后比较它们的大小。 这是正确的，因为游戏结果仅取决于每个玩家收到的弹珠数量。 然而，额外的存储是不必要的，因为只有计数才重要。 

关键的观察结果是，大理石值本身对结果的影响不会超过平价。 我们不关心大理石是否含有`2`或者`1000000000`，仅判断是否为偶数。 一旦我们认识到这一点，整个问题就简化为计算偶数和奇数。 

数完后，只有当偶数弹珠的数量严格大于奇数弹珠的数量时，塞巴斯蒂安才会保留名字。 所有其他情况，包括关系，都会产生`"Notbastian"`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 显式存储两个玩家的弹珠 | O(n) | O(n) | 已接受但没有必要 |
 | 计算偶数和赔率 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 阅读`n`和`n`大理石的价值。 
2. 初始化`even_count = 0`和`odd_count = 0`。 
3. 扫描每个弹珠的值。 
4. 如果值为偶数，则增加`even_count`; 否则增加`odd_count`。 
5. 处理完所有弹珠后，比较计数。 
6. 如果`even_count > odd_count`， 打印`"Sebastian"`因为塞巴斯蒂安有更多的弹珠。 
7. 否则打印`"Notbastian"`。 这包括平局的情况，塞巴斯蒂安按规则获胜。 

### 为什么它有效

 每个弹珠都属于一个完全基于平价的玩家。 计算偶数即为塞巴斯蒂安收到的弹珠数量，计算奇数即为塞巴斯蒂安收到的弹珠数量。 获胜者完全是通过比较这些计数来确定的，塞巴斯蒂安获得平局。 由于该算法精确计算这两个量并应用规定的比较规则，因此它总是产生正确的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))

even_count = 0

for x in a:
    if x % 2 == 0:
        even_count += 1

odd_count = n - even_count

if even_count > odd_count:
    print("Sebastian")
else:
    print("Notbastian")
```该解决方案对数组执行一次遍历并对偶数值进行计数。 由于每个弹珠要么是偶数，要么是奇数，奇数计数可以计算为`n - even_count`。 

最后的比较是严格的。 这是最重要的实施细节。 使用`>=`会错误地将关系授予 Sebastiàn，与声明相矛盾。 

不存在溢出问题，因为计数永远不会超过`n`，这最多是`10^6`。 

## 工作示例

 ### 示例 1

 输入：```
4
1 2 2 4
```| 大理石 | 平价 | 偶数计数 | 奇数计数 |
 | --- | --- | --- | --- |
 | 1 | 奇数| 0 | 1 |
 | 2 | 甚至| 1 | 1 |
 | 2 | 甚至| 2 | 1 |
 | 4 | 甚至| 3 | 1 |

 最终比较：`3 > 1`。 

输出：```
Sebastian
```这表明了塞巴斯蒂安的正常获胜案例，他比塞巴斯蒂安获得了更多的弹珠。 

### 示例 2

 输入：```
4
1 1 2 2
```| 大理石 | 平价 | 偶数计数 | 奇数计数 |
 | --- | --- | --- | --- |
 | 1 | 奇数| 0 | 1 |
 | 1 | 奇数| 0 | 2 |
 | 2 | 甚至| 1 | 2 |
 | 2 | 甚至| 2 | 2 |

 最终比较：`2 = 2`。 

输出：```
Notbastian
```这个例子强调了平局规则。 尽管两名玩家获得的弹珠数量相同，但塞巴斯蒂安赢得了平局，因此塞巴斯蒂安必须更改他的名字。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个弹珠都被检查一次 |
 | 空间| O(1) | O(1) | 仅存储了几个计数器|

 高达`10^6`弹珠，线性扫描很容易足够快。 无论输入大小如何，内存使用量都保持不变。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    n = int(input())
    a = list(map(int, input().split()))

    even_count = sum(x % 2 == 0 for x in a)
    odd_count = n - even_count

    if even_count > odd_count:
        return "Sebastian\n"
    return "Notbastian\n"

# provided samples
assert run("4\n1 2 2 4\n") == "Sebastian\n", "sample 1"
assert run("4\n1 1 2 2\n") == "Notbastian\n", "sample 2"

# custom cases
assert run("1\n2\n") == "Sebastian\n", "single even marble"
assert run("1\n1\n") == "Notbastian\n", "single odd marble"
assert run("5\n2 4 6 8 10\n") == "Sebastian\n", "all even"
assert run("5\n1 3 5 7 9\n") == "Notbastian\n", "all odd"
assert run("6\n1 2 3 4 5 6\n") == "Notbastian\n", "tie case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 2`|`Sebastian`| 最小尺寸，即使是大理石 |
 |`1 / 1`|`Notbastian`| 最小尺寸，奇数大理石 |
 | 所有偶数值 |`Sebastian`| 塞巴斯蒂安接收每一颗弹珠 |
 | 所有奇数值 |`Notbastian`| 塞巴斯蒂安一无所获 |
 | 奇数和偶数相等 |`Notbastian`| 正确处理领带 |

 ## 边缘情况

 考虑平局场景：```
4
1 1 2 2
```该算法计算两个奇数弹珠和两个偶数弹珠。 自从`even_count > odd_count`是假的，它打印`"Notbastian"`。 这完全符合特殊平局规则。 

考虑塞巴斯蒂安收到所有弹珠的情况：```
3
2 4 6
```扫描产生`even_count = 3`和`odd_count = 0`。 比较成功，所以输出为：```
Sebastian
```考虑相反的极端：```
3
1 3 5
```扫描产生`even_count = 0`和`odd_count = 3`。 比较失败，所以输出为：```
Notbastian
```这些案例涵盖了问题唯一微妙的方面，即严格获胜与平局之间的区别。 计数方法可以自然地处理所有这些问题。
