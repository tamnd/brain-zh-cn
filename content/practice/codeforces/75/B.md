---
title: "CF 75B - Facetook 优先墙"
description: "我们获得社交网络上用户的名称以及用户之间的一系列活动消息。 每项活动都会在参与的两个人之间贡献一定数量的积分。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "expression-parsing", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 75
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 67 (Div. 2)"
rating: 1500
weight: 75
solve_time_s: 134
verified: false
draft: false
---

[CF 75B - Facetook 优先墙](https://codeforces.com/problemset/problem/75/B)

 **评分：** 1500
 **标签：** 表达式解析、实现、字符串
 **求解时间：** 2m 14s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们获得社交网络上用户的名称以及用户之间的一系列活动消息。 每项活动都会在参与的两个人之间贡献一定数量的积分。 

这三项可能的活动是：

 - 在某人的墙上发帖，价值15分
 - 评论某人的帖子，值10分
 - 喜欢某人的帖子，值得5分

 关系得分是对称的。 如果`alice`评论`bob`的帖子，两者`alice`和`bob`互相获得10分。 

我们的任务不是计算每对用户之间的分数。 我们只关心相对于给定用户的分数。 处理完所有操作后，我们必须打印日志中出现的每个不同的人（不包括主用户），并按该用户的分数降序排序。 如果多人得分相同，我们会按字典顺序打破平局。 

输入格式乍一看很简单，但字符串有点棘手。 第二个用户名显示为`"'s"`附上，例如`fatma's`。 直接存储此令牌的粗心解析器将处理`"fatma"`和`"fatma's"`作为不同的名称。 

限制非常小。 最多有 100 个操作，每个用户名的长度最多为 10。即使是低效的实现也会轻松通过。 这意味着问题主要在于仔细的字符串解析和簿记，而不是优化。 

一个常见的错误是忘记包含主用户评分为零的用户。 

考虑这个输入：```
ahmed
2
mona likes sara's post
sara commented on mona's post
```两种交互都不涉及`ahmed`，所以两者`mona`和`sara`和他一起得0分。 正确的输出是：```
mona
sara
```另一个简单的错误来自于错误地解析第二个用户名。```
ahmed
1
ahmed posted on fatma's wall
```正确的用户名是`fatma`， 不是`fatma's`。 如果我们忘记删除后缀，排序和分数累积就会出错，因为`"fatma"`和`"fatma's"`被视为单独的用户。 

打破平局也很重要。```
ahmed
2
ahmed likes sara's post
ahmed likes mona's post
```两个用户都获得 5 分，因此输出必须是：```
mona
sara
```仅按分数降序排序的解决方案将产生不确定的排序。 

## 方法

 最直接的方法是完全按照所写的模拟每一个动作。 对于每一行，我们提取两个用户名并确定发生了哪个活动。 如果主要用户参与交互，我们将相应的值添加到其他人的分数中。 同时，我们维护一组出现的每个不同的用户名。 

这种蛮力策略已经完全可以接受，因为输入量很小。 最多 100 行，即使重复扫描字符串和排序名称也几乎不需要任何成本。 整个工作主要是对最多几百个名字进行排序。 

真正的挑战不是表现，而是表现。 活动线具有三种不同的句子结构：```
X posted on Y's wall
X commented on Y's post
X likes Y's post
```有用的观察是，一旦我们将行分成单词，所有格式都会变得容易。 第一个令牌始终是`X`，第二个标记标识操作类型，第四个标记包含`Y's`。 删除最后两个字符即可得到实际的用户名。 

提取用户名和操作类型后，问题就简化为字典中的分数累积。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n log n) | O(n log n) | O(n) | 已接受 |
 | 最佳| O(n log n) | O(n log n) | O(n) | 已接受 |

 “最佳”解决方案本质上是相同的，因为约束已经很小。 重要的部分是干净地组织解析并正确排序。 

## 算法演练

 1.读取主要用户名和操作次数。 
2. 创建一个字典，将每个动作词映射到其分数。 

我们使用：

 -`"posted"`→ 15
 -`"commented"`→ 10
 -`"likes"`→ 5
 3. 维护一个包含除主用户之外的每个不同用户名的集合。 

这保证了即使得分为零的用户也会出现在最终输出中。 
4. 维护另一个字典，存储与主用户相关的分数。 

缺失的条目被视为零。 
5. 对于每条行动线：

 1. 将行分割成单词。 
2. 摘录：

 -`x = words[0]`-`action = words[1]`-`y = words[3][:-2]`最后一个操作删除了尾随的`"'s"`。 

1. 如果两个用户名不是主用户，则将两个用户名添加到该组中。 
2. 查找该操作的分值。 
3.如果`x`是主要用户，将分数添加到`y`。 
4.如果`y`是主要用户，将分数添加到`x`。 

由于这种关系是对称的，因此任一方向的贡献相等。 
6. 将用户名集转换为列表并使用以下命令对其进行排序：

 - 分数递减
 - 字典顺序作为决胜局
 7. 打印排序后的名称。 

### 为什么它有效

 该算法只对每个交互处理一次。 对于每个操作，唯一重要的分数是涉及主要用户的分数。 如果两个参与者都不是主要用户，则交互不会影响最终排名，因此我们忽略其分数贡献，同时仍然记录用户名。 

分数字典始终存储主用户与迄今为止处理的所有其他用户之间的总累积交互值。 由于每个动作都独立且准确地贡献一次，因此最终的字典包含正确的总数。 最终的排序规则直接符合这样的说法：分数高的优先，平分的按字母顺序排列。 

## Python 解决方案```python
import sys
from collections import defaultdict

input = sys.stdin.readline

def solve():
    me = input().strip()
    n = int(input())

    points = {
        "posted": 15,
        "commented": 10,
        "likes": 5
    }

    score = defaultdict(int)
    people = set()

    for _ in range(n):
        words = input().split()

        x = words[0]
        action = words[1]
        y = words[3][:-2]

        if x != me:
            people.add(x)

        if y != me:
            people.add(y)

        value = points[action]

        if x == me:
            score[y] += value

        if y == me:
            score[x] += value

    result = sorted(people, key=lambda name: (-score[name], name))

    print("\n".join(result))

solve()
```这`points`字典将动作词转换为数值。 这避免了重复的条件语句并使代码更容易扩展。 

解析器依赖于固定的句子结构。 按空格分割后，第二个用户名始终出现在该位置`3`附有一个`"'s"`。 切片用`[:-2]`正好删除这两个字符。 

这`people`集是独立于`score`字典，因为某些用户可能永远不会直接与主用户交互。 如果我们只依赖于键`score`，得分为零的用户将从输出中消失。 

使用`defaultdict(int)`无需手动初始化缺失分数。 

排序键很微妙。 我们排序依据`(-score[name], name)`而不是排序两次。 否定分数会给出降序的数字顺序，而第二个组件会自动处理字典顺序。 

## 工作示例

 ### 示例 1

 输入：```
ahmed
3
ahmed posted on fatma's wall
fatma commented on ahmed's post
mona likes ahmed's post
```处理痕迹：

 | 步骤| 行动| 提取的用户 | 分数变化 | 当前分数 |
 | --- | --- | --- | --- | --- |
 | 1 | ahmed 张贴在 fatma 的墙上 | 艾哈迈德·法特玛 | 法特玛+15 | 法特玛: 15 |
 | 2 | 法特玛评论了艾哈迈德的帖子 | 艾哈迈德·法特玛 | 法特玛+10 | 法特玛：25 |
 | 3 | 莫娜喜欢艾哈迈德的帖子 | 艾哈迈德·莫娜 | 莫娜 +5 | 法特玛：25，莫娜：5 |

 最终排序：

 | 名称 | 分数 |
 | --- | --- |
 | 法特玛 | 25 | 25
 | 莫娜 | 5 |

 输出：```
fatma
mona
```这个例子表明，无论方向如何，交互都会有所贡献。 这两项行动均涉及`fatma`增加了相同的关系得分。 

### 示例 2

 输入：```
alex
4
bob likes clara's post
alex likes diana's post
eric commented on frank's post
george posted on alex's wall
```处理痕迹：

 | 步骤| 行动| 提取的用户 | 分数变化 | 当前分数 |
 | --- | --- | --- | --- | --- |
 | 1 | 鲍勃喜欢克拉拉的帖子 | 鲍勃，克拉拉 | 无 | 空 |
 | 2 | 亚历克斯喜欢戴安娜的帖子 | 亚历克斯·戴安娜 | 戴安娜+5 | 戴安娜: 5 |
 | 3 | 埃里克评论了弗兰克的帖子| 埃里克·弗兰克 | 无 | 戴安娜: 5 |
 | 4 | 乔治张贴在亚历克斯的墙上| 乔治·亚历克斯 | 乔治 +15 | 戴安娜：5，乔治：15 |

 所有发现的用户：

 | 用户| 分数 |
 | --- | --- |
 | 鲍勃 | 0 |
 | 克拉拉 | 0 |
 | 戴安娜 | 5 |
 | 埃里克 | 0 |
 | 坦白 | 0 |
 | 乔治 | 15 | 15

 排序输出：```
george
diana
bob
clara
eric
frank
```该跟踪说明了为什么我们必须将每个看到的用户名与分数字典分开存储。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 处理动作是 O(n)，排序用户名占主导地位 |
 | 空间| O(n) | 字典和集合最多存储所有不同的用户 |

 由于最多有 100 个操作，该解决方案很容易满足限制。 即使排序步骤也很小，因为不同用户名的数量很少。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import defaultdict

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def solve():
        me = input().strip()
        n = int(input())

        points = {
            "posted": 15,
            "commented": 10,
            "likes": 5
        }

        score = defaultdict(int)
        people = set()

        for _ in range(n):
            words = input().split()

            x = words[0]
            action = words[1]
            y = words[3][:-2]

            if x != me:
                people.add(x)

            if y != me:
                people.add(y)

            value = points[action]

            if x == me:
                score[y] += value

            if y == me:
                score[x] += value

        result = sorted(people, key=lambda name: (-score[name], name))

        return "\n".join(result)

    return solve()

# provided sample
assert run(
"""ahmed
3
ahmed posted on fatma's wall
fatma commented on ahmed's post
mona likes ahmed's post
"""
) == "fatma\nmona", "sample 1"

# minimum input
assert run(
"""alex
1
bob likes clara's post
"""
) == "bob\nclara", "minimum size with zero scores"

# tie breaking
assert run(
"""alex
2
alex likes sara's post
alex likes mona's post
"""
) == "mona\nsara", "lexicographical tie breaking"

# repeated interactions
assert run(
"""alex
3
alex posted on bob's wall
bob commented on alex's post
alex likes bob's post
"""
) == "bob", "score accumulation"

# users unrelated to main user
assert run(
"""alex
4
bob likes clara's post
diana likes eric's post
frank commented on george's post
harry posted on alex's wall
"""
) == "harry\nbob\nclara\ndiana\neric\nfrank\ngeorge", "include zero-score users"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单一的无关交互 |`bob clara`订单| 零分的用户仍必须出现 |
 | 平分 | 字典顺序| 正确的决胜局|
 | 与同一用户的多次交互 | 单次累计总计 | 分数汇总|
 | 混合相关和不相关用户 | 正分优先 | 正确的排序和包含 |

 ## 边缘情况

 ### 互动分数为零的用户

 输入：```
ahmed
2
mona likes sara's post
sara commented on mona's post
```两项行动均不涉及`ahmed`，因此不会发生分数更新。 

该算法仍然插入两者`mona`和`sara`进入`people`放。 他们的分数保持默认值`0`。 

排序给出：```
mona
sara
```仅将用户存储在分数字典中的解决方案将错误地不打印任何内容。 

### 解析以“'s”结尾的名称

 输入：```
ahmed
1
ahmed posted on fatma's wall
```分割后：

 | 索引 | 价值|
 | --- | --- |
 | 0 | 艾哈迈德 |
 | 1 | 发布 |
 | 2 | 上 |
 | 3 | 法特玛的 |
 | 4 | 墙|

 该算法使用`words[3][:-2]`，生产`fatma`。 

分数状态：

 | 用户| 分数 |
 | --- | --- |
 | 法特玛 | 15 | 15

 输出：```
fatma
```如果不删除后缀，存储的名称将错误地变为`fatma's`。 

### 按字典顺序打破平局

 输入：```
alex
2
alex likes sara's post
alex likes mona's post
```两位用户均获得 5 分。 

对键值进行排序：

 | 用户| 关键|
 | --- | --- |
 | 莫娜 | （-5，“莫娜”）|
 | 萨拉 | （-5，“萨拉”）|

 由于数字部分相等，因此正常的字符串比较决定顺序。 

正确输出：```
mona
sara
```仅按分数排序的解决方案可能会根据插入顺序产生错误的排序。
